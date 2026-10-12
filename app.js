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
    const R={m:['Maestro verificado','Es maestro de Juan Rulfo'],o:['Orientador verificado','Es orientador de Juan Rulfo'],s:['Escuela verificada','Escuela registrada y verificada en Unknow']}[v.dataset.role];
    const m=R?[R[1]]:((o&&o.verif_motivos)||[]);
    const pop=document.createElement('div');pop.className='vpop';
    pop.innerHTML='<b>'+(R?R[0]:'Perfil verificado')+'</b>'+(m.length?'<ul>'+m.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p>Sin detalles todavía.</p>');
    document.body.appendChild(pop);
    const r=v.getBoundingClientRect(),w=pop.offsetWidth;
    pop.style.left=Math.max(10,Math.min(innerWidth-w-10,r.left+r.width/2-w/2))+'px';
    pop.style.top=(r.bottom+window.scrollY+10)+'px';
    requestAnimationFrame(()=>pop.classList.add('on'));
  },true);
  window.addEventListener('scroll',()=>document.querySelectorAll('.vpop').forEach(x=>x.remove()),{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.vpop').forEach(x=>x.remove());if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('vf'))e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}))});
  window.rbadge=function(r){
    if(r==='m')return '<svg class="vf rb rb-m" data-role="m" tabindex="0" viewBox="0 0 24 24" role="img" aria-label="Maestro verificado"><title>Maestro verificado</title><path fill="#22c55e" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.54-1.4.28-3.04-.84-4.16s-2.76-1.38-4.16-.84A4.2 4.2 0 0 0 12 1.5c-1.58 0-2.95.88-3.66 2.18-1.4-.54-3.04-.28-4.16.84s-1.38 2.76-.84 4.16A4.2 4.2 0 0 0 1.5 12.5c0 1.58.88 2.95 2.18 3.66-.54 1.4-.28 3.04.84 4.16s2.76 1.38 4.16.84c.71 1.3 2.08 2.18 3.66 2.18s2.95-.88 3.66-2.18c1.4.54 3.04.28 4.16-.84s1.38-2.76.84-4.16c1.3-.71 2.18-2.08 2.18-3.66z"/><path fill="#fff" d="M12 7 5 10.2l7 3.2 5.2-2.4v3.8h1.3v-4.4zM8 13.3v2.2c0 1 1.8 2 4 2s4-1 4-2v-2.2l-4 1.8z"/></svg>';
    if(r==='o')return '<svg class="vf rb rb-o" data-role="o" tabindex="0" viewBox="0 0 24 24" role="img" aria-label="Orientador verificado"><title>Orientador verificado</title><path fill="#a855f7" d="M12 1.5 20.5 4.7v6.6c0 5-3.4 9.4-8.5 11.2-5.1-1.8-8.5-6.2-8.5-11.2V4.7z"/><path fill="#fff" d="M12 6.2l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z"/></svg>';
    if(r==='s')return '<svg class="vf rb rb-s" data-role="s" tabindex="0" viewBox="0 0 24 24" role="img" aria-label="Escuela verificada"><title>Escuela verificada</title><path fill="#f59e0b" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.54-1.4.28-3.04-.84-4.16s-2.76-1.38-4.16-.84A4.2 4.2 0 0 0 12 1.5c-1.58 0-2.95.88-3.66 2.18-1.4-.54-3.04-.28-4.16.84s-1.38 2.76-.84 4.16A4.2 4.2 0 0 0 1.5 12.5c0 1.58.88 2.95 2.18 3.66-.54 1.4-.28 3.04.84 4.16s2.76 1.38 4.16.84c.71 1.3 2.08 2.18 3.66 2.18s2.95-.88 3.66-2.18c1.4.54 3.04.28 4.16-.84s1.38-2.76.84-4.16c1.3-.71 2.18-2.08 2.18-3.66z"/><path fill="#fff" d="M12 6 5.5 9v1.2h13V9zM7 11.2v4.6H5.5v1.5h13v-1.5H17v-4.6h-1.5v4.6h-2v-4.6h-3v4.6h-2v-4.6z"/></svg>';
    return '';
  };
  window.vbadge=function(o){return vbadge0(o)+ubadge(o)};
  window.esc=function(x){return String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))};
})();
