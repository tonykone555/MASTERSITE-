(()=>{
  const panels=[...document.querySelectorAll('.surface-panel')];
  if(!panels.length) return;

  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  panels.forEach((panel)=>{
    const slab=panel.querySelector('.surface-slab');
    if(!slab) return;
    if(!slab.querySelector('.object-shadow')){
      slab.insertAdjacentHTML('afterbegin', '<span class="object-shadow" aria-hidden="true"></span><span class="object-backplate" aria-hidden="true"></span><span class="object-bottom" aria-hidden="true"></span><span class="object-side" aria-hidden="true"></span><span class="object-face" aria-hidden="true"></span>');
    }
  });

  let raf=0;
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const render=()=>{
    raf=0;
    const vh=Math.max(1, innerHeight);
    panels.forEach((panel, idx)=>{
      const slab=panel.querySelector('.surface-slab');
      if(!slab) return;
      if(reduce){
        slab.style.setProperty('--front-float-y','0px');
        slab.style.setProperty('--front-tilt-x','0deg');
        slab.style.setProperty('--front-tilt-y','0deg');
        slab.style.setProperty('--front-scale','1');
        return;
      }
      const r=panel.getBoundingClientRect();
      const center=r.top + r.height/2;
      const delta=clamp((center - vh/2) / vh, -1.2, 1.2);
      const focus=clamp(1 - Math.abs(delta), 0, 1);
      const dir = idx % 2 === 0 ? 1 : -1;
      const floatY = delta * 34;
      const tiltX = delta * -1.8;
      const tiltY = dir * (0.9 - focus) * 1.4;
      const scale = 0.97 + focus * 0.04;
      slab.style.setProperty('--front-float-y', `${floatY.toFixed(2)}px`);
      slab.style.setProperty('--front-tilt-x', `${tiltX.toFixed(2)}deg`);
      slab.style.setProperty('--front-tilt-y', `${tiltY.toFixed(2)}deg`);
      slab.style.setProperty('--front-scale', scale.toFixed(4));
    });
  };
  const request=()=>{ if(!raf) raf=requestAnimationFrame(render); };
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request, {passive:true});
  request();
})();
