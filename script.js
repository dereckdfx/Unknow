const intro=document.getElementById('intro'),login=document.getElementById('login'),
form=document.getElementById('form'),input=document.getElementById('code'),error=document.getElementById('error'),
btn=form.querySelector('button');
setTimeout(()=>{intro.classList.add('done');login.classList.remove('hidden');requestAnimationFrame(()=>login.classList.add('show'));input.focus()},1150);
input.addEventListener('input',()=>{
  const raw=input.value.replace(/[^a-z0-9]/gi,'').toUpperCase().slice(0,16);
  input.value=raw.match(/.{1,4}/g)?.join('-')||'';
  error.textContent='';
});
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const raw=input.value.replace(/-/g,'').toUpperCase();
  if(raw.length!==16){error.textContent='El código debe tener 16 caracteres.';return}
  btn.disabled=true;error.textContent='';
  try{
    const r=await fetch('/api/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:raw})});
    const d=await r.json().catch(()=>({}));
    if(r.ok&&d.ok){window.location.href='home.html';return}
    error.textContent=d.error||'Código incorrecto.';
    input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake');
  }catch{error.textContent='No se pudo verificar. Intenta de nuevo.';}
  finally{btn.disabled=false}
});
