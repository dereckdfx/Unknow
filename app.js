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
  window.esc=function(x){return String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))};
})();
