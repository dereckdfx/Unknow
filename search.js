(function(){
  const s=document.getElementById('search'),q=document.getElementById('q'),c=document.getElementById('clear'),rp=document.getElementById('ripple'),res=document.getElementById('results');
  let tm,ITEMS=[{name:'Juan Rulfo',sub:'a.k.a Juan Rulfo 0986',url:'/escuela/juanrulfo.html'}];
  fetch('/api/escuela').then(r=>r.ok?r.json():null).then(D=>{
    if(!D)return;
    D.sin_clasificar.forEach(a=>ITEMS.push({name:a.nombre,sub:'a.k.a '+a.aka,url:'/estudiante/juanrulfo/'+a.slug+'.html'}));
    if(q.value)render();
  }).catch(()=>{});
  function bump(){rp.classList.remove('go');void rp.offsetWidth;rp.classList.add('go');s.classList.add('typing');clearTimeout(tm);tm=setTimeout(()=>s.classList.remove('typing'),500)}
  function norm(t){return t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function esc(x){return String(x).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
  function render(){
    const v=norm(q.value);
    if(!v){res.classList.remove('show');return}
    const m=ITEMS.filter(i=>norm(i.name).includes(v)||norm(i.sub).includes(v)).slice(0,8);
    res.innerHTML=m.length?m.map(i=>'<a href="'+i.url+'"><span class="ico">'+esc(i.name[0].toUpperCase())+'</span><span>'+esc(i.name)+'<small>'+esc(i.sub)+'</small></span></a>').join(''):'<div class="none">Sin resultados</div>';
    res.classList.add('show');
  }
  q.addEventListener('input',()=>{s.classList.toggle('has',q.value.length>0);bump();render()});
  q.addEventListener('keydown',e=>{if(e.key==='Backspace'||e.key==='Delete')bump();if(e.key==='Enter'){const a=res.querySelector('a');if(a)location.href=a.getAttribute('href')}});
  q.addEventListener('focus',render);
  c.addEventListener('click',()=>{s.classList.add('clearing');setTimeout(()=>{q.value='';s.classList.remove('has','clearing');bump();q.focus();render()},180)});
  document.addEventListener('click',e=>{if(!s.contains(e.target))res.classList.remove('show')});
})();
