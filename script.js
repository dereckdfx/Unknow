const intro=document.getElementById('intro'),login=document.getElementById('login'),
form=document.getElementById('form'),input=document.getElementById('code'),error=document.getElementById('error');
setTimeout(()=>{intro.classList.add('done');login.classList.remove('hidden');requestAnimationFrame(()=>login.classList.add('show'));input.focus()},2300);
input.addEventListener('input',()=>{
  const raw=input.value.replace(/[^a-z0-9]/gi,'').toUpperCase().slice(0,16);
  input.value=raw.match(/.{1,4}/g)?.join('-')||'';
  error.textContent='';
});
async function sha256(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  const raw=input.value.replace(/-/g,'');
  if(raw.length!==16){error.textContent='El código debe tener 16 caracteres.';return}
  if(await sha256(raw)===window.CODE_HASH){sessionStorage.setItem('auth','1');window.location.href='home.html'}
  else{error.textContent='Código incorrecto.';input.classList.remove('shake');void input.offsetWidth;input.classList.add('shake')}
});
