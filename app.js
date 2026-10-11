(function(){
  // entrada de página
  requestAnimationFrame(()=>document.body.classList.add('ready'));
  window.addEventListener('pageshow',e=>{if(e.persisted){document.body.classList.remove('leaving');document.body.classList.add('ready')}});
  // salida suave al navegar por enlaces internos
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0||a.target==='_blank')return;
    const u=new URL(a.href,location.href);
    if(u.origin!==location.origin||u.pathname===location.pathname&&u.search===location.search)return;
    e.preventDefault();document.body.classList.add('leaving');
    setTimeout(()=>{location.href=u.href},200);
  });
  // revelar secciones al hacer scroll
  const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.08}):null;
  window.observeReveal=function(root){(root||document).querySelectorAll('.reveal:not(.in)').forEach(el=>io?io.observe(el):el.classList.add('in'))};
  observeReveal();
  // guardia de sesión
  window.requireSession=async function(){
    try{const r=await fetch('/api/session',{cache:'no-store'});if(!r.ok)throw 0}
    catch{location.replace('/index.html');return false}
    return true;
  };
  window.av=function(o){
    if(o&&!o.foto&&o.slug&&window.ALL){const f=window.ALL.find(x=>x.slug===o.slug);if(f)o=f}
    return o&&o.foto?'<img src="'+esc(o.foto)+'" alt="" loading="eager" onerror="this.replaceWith(document.createTextNode(\''+esc(((o.nombre)||'?')[0].toUpperCase())+'\'))">':esc(((o&&o.nombre)||'?')[0].toUpperCase());
  };
  window.ubadge=function(o){
    if(o&&!o.logo_unknow&&o.slug&&window.ALL){const f=window.ALL.find(x=>x.slug===o.slug);if(f)o=f}
    return o&&o.logo_unknow?'<img class="ulogo" src="/img/unknow-logo.svg" alt="Unknow" title="Unknow">':'';
  };
  window.vbadge0=function(o){
    if(o&&!o.verificado&&o.slug&&window.ALL){const f=window.ALL.find(x=>x.slug===o.slug);if(f)o=f}
    return o&&o.verificado?'<svg class="vf" data-slug="'+esc(o.slug||'')+'" tabindex="0" viewBox="0 0 24 24" role="img" aria-label="Perfil verificado"><title>Perfil verificado</title><path fill="'+esc(o.verificado)+'" d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/></svg>':'';
  };
  window.dn=function(o){if(o&&!o.mostrar&&o.slug&&window.ALL){const f=window.ALL.find(x=>x.slug===o.slug);if(f)o=f}return (o&&(o.mostrar||o.nombre))||''};
  document.addEventListener('click',e=>{
    const v=e.target.closest('.vf');
    document.querySelectorAll('.vpop').forEach(x=>x.remove());
    if(!v)return;
    e.preventDefault();e.stopPropagation();
    const o=(window.ALL||[]).find(x=>x.slug===v.dataset.slug);
    const m=(o&&o.verif_motivos)||[];
    const pop=document.createElement('div');pop.className='vpop';
    pop.innerHTML='<b>Perfil verificado</b>'+(m.length?'<ul>'+m.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>Sin detalles todavía.</p>');
    document.body.appendChild(pop);
    const r=v.getBoundingClientRect(),w=pop.offsetWidth;
    pop.style.left=Math.max(10,Math.min(innerWidth-w-10,r.left+r.width/2-w/2))+'px';
    pop.style.top=(r.bottom+window.scrollY+10)+'px';
    requestAnimationFrame(()=>pop.classList.add('on'));
  },true);
  window.addEventListener('scroll',()=>document.querySelectorAll('.vpop').forEach(x=>x.remove()),{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.vpop').forEach(x=>x.remove());if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('vf'))e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))});
  window.vbadge=function(o){return vbadge0(o)+ubadge(o)};
  window.esc=function(x){return String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))};
})();
