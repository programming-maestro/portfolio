// main.js - small interactions
(function(){
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.card.entrance').forEach((c,i)=>{
      c.style.opacity = 0;
      setTimeout(()=> c.classList.remove('entrance'), 80 * i);
    });
    // simple project click effect
    document.querySelectorAll('.project').forEach(p => p.addEventListener('click', ()=>{
      p.style.transform = 'scale(1.01)';
      setTimeout(()=>p.style.transform = '',160);
    }));
  });
})();