(function(){
  const s=document.getElementById('search'),q=document.getElementById('q'),c=document.getElementById('clear'),rp=document.getElementById('ripple'),res=document.getElementById('results');
  if(!s)return;
  let tm,sel=-1,ITEMS=[{role:'s',name:'Juan Rulfo',sub:'a.k.a Juan Rulfo 0986',url:'/escuela/juanrulfo.html'}];
  fetch('/api/escuela',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(D=>{
    if(!D)return;window.ALL=[].concat(D.sin_clasificar,...Object.values(D.estudiantes_por_grado||{}),D.familiares||[]);
    const add=(a,extra)=>ITEMS.push({name:a.mostrar||a.nombre,full:a.nombre,sub:(extra?extra+' · ':'')+'a.k.a '+a.aka,keys:(a.alias||[]).join(' '),foto:a.foto||'',ver:a.verificado||'',slug:a.slug,url:'/estudiante/juanrulfo/'+a.slug+'.html'});
    D.sin_clasificar.forEach(a=>add(a));
    Object.keys(D.estudiantes_por_grado||{}).forEach(g=>(D.estudiantes_por_grado[g]||[]).forEach(a=>add(a,g)));
    [].concat((D.maestros||[]).map(x=>[x,'Maestro']),(D.orientadores||[]).map(x=>[x,'Orientador'])).forEach(([a,r])=>ITEMS.push({name:a.nombre,sub:r+' de 3A',foto:'',url:'/estudiante/juanrulfo/'+a.slug+'.html'}));
    (D.familiares||[]).forEach(a=>ITEMS.push({name:a.nombre,sub:a.rol,foto:a.foto||'',url:'/estudiante/juanrulfo/'+a.slug+'.html'}));
    if(q.value)render();
  }).catch(()=>{});
  function bump(){rp.classList.remove('go');void rp.offsetWidth;rp.classList.add('go');s.classList.add('typing');clearTimeout(tm);tm=setTimeout(()=>s.classList.remove('typing'),500)}
  function norm(t){return t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function esc(x){return String(x).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
  function hl(text,v){
    const n=norm(text),i=n.indexOf(v);
    if(i<0||n.length!==text.length)return esc(text);
    return esc(text.slice(0,i))+'<mark>'+esc(text.slice(i,i+v.length))+'</mark>'+esc(text.slice(i+v.length));
  }
  function render(){
   try{
    const v=norm(q.value);sel=-1;
    if(!v){res.classList.remove('show');return}
    const m=ITEMS.filter(i=>norm(i.name).includes(v)||norm(i.full||'').includes(v)||norm(i.sub).includes(v)||(i.keys&&norm(i.keys).includes(v))).sort((a,b)=>(norm(a.name).startsWith(v)?0:1)-(norm(b.name).startsWith(v)?0:1)).slice(0,8);
    res.innerHTML=m.length?m.map((i,k)=>'<a href="'+i.url+'" style="--i:'+k+'"><span class="ico">'+(i.foto?'<img src="'+esc(i.foto)+'" alt="">':esc(i.name[0].toUpperCase()))+'</span><span>'+hl(i.name,v)+((i.role&&window.rbadge)?window.rbadge(i.role):'')+((i.ver&&window.vbadge)?window.vbadge({verificado:i.ver,slug:i.slug}):'')+'<small>'+esc(i.sub)+'</small></span></a>').join(''):'<div class="none">Sin resultados</div>';
    res.classList.add('show');
   }catch(err){console.error(err);res.innerHTML='<div class="none">Error al buscar</div>';res.classList.add('show')}
  }
  function move(d){
    const a=[...res.querySelectorAll('a')];if(!a.length)return;
    sel=(sel+d+a.length)%a.length;
    a.forEach((el,k)=>el.classList.toggle('sel',k===sel));
    a[sel].scrollIntoView({block:'nearest'});
  }
  q.addEventListener('input',()=>{s.classList.toggle('has',q.value.length>0);bump();render()});
  q.addEventListener('keydown',e=>{
    if(e.key==='Backspace'||e.key==='Delete')bump();
    if(e.key==='ArrowDown'){e.preventDefault();move(1)}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
    else if(e.key==='Escape'){res.classList.remove('show');q.blur()}
    else if(e.key==='Enter'){const a=res.querySelector('a.sel')||res.querySelector('a');if(a)a.click()}
  });
  document.addEventListener('keydown',e=>{if(e.key==='/'&&document.activeElement!==q&&!/input|textarea/i.test(document.activeElement.tagName)){e.preventDefault();q.focus()}});
  q.addEventListener('focus',render);
  c.addEventListener('click',()=>{s.classList.add('clearing');setTimeout(()=>{q.value='';s.classList.remove('has','clearing');bump();q.focus();render()},180)});
  document.addEventListener('click',e=>{if(!s.contains(e.target))res.classList.remove('show')});
})();
