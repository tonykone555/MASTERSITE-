(()=>{
  const fetchParts=async(paths)=>{
    const parts=await Promise.all(paths.map(p=>fetch(p,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(p);return r.text()})));
    return 'data:image/webp;base64,'+parts.join('');
  };

  const assets={
    stone:['assets/tiny/stone.b64'],
    marble:['assets/tiny/marble.b64'],
    wood:['assets/tiny/wood.b64'],
    glass:['assets/tiny/glass.b64']
  };
  const mapping=[['.surface-travertine','stone'],['.surface-marble','marble'],['.surface-oak','wood'],['.surface-glass','glass']];

  mapping.forEach(async([selector,key])=>{
    const panel=document.querySelector(selector),slab=panel?.querySelector('.surface-slab');
    if(!slab)return;
    slab.classList.add('real-slab-mode');
    let img=slab.querySelector('.real-slab-object');
    if(!img){
      img=document.createElement('img');
      img.className='real-slab-object';
      img.alt='';
      img.decoding='async';
      img.draggable=false;
      slab.prepend(img);
    }
    try{img.src=await fetchParts(assets[key]);}catch(e){console.warn('slab asset failed',key);}
  });

  const panels=[...document.querySelectorAll('.surface-panel:not(.surface-linen)')];
  let raf=0;
  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const updateSlabs=()=>{
    raf=0;
    const vh=Math.max(1,innerHeight);
    panels.forEach((panel,i)=>{
      const slab=panel.querySelector('.surface-slab.real-slab-mode');
      if(!slab)return;
      const r=panel.getBoundingClientRect();
      const delta=clamp(((r.top+r.height/2)-vh/2)/vh,-1.1,1.1);
      const focus=clamp(1-Math.abs(delta),0,1);
      const dir=i%2?1:-1;
      slab.style.setProperty('--real-y',`${(delta*24).toFixed(1)}px`);
      slab.style.setProperty('--real-rx',`${(-delta*.8).toFixed(2)}deg`);
      slab.style.setProperty('--real-ry',`${(dir*(1-focus)*.55).toFixed(2)}deg`);
      slab.style.setProperty('--real-scale',(.98+focus*.03).toFixed(4));
    });
  };
  const request=()=>{if(!raf)raf=requestAnimationFrame(updateSlabs);};
  addEventListener('scroll',request,{passive:true});
  addEventListener('resize',request,{passive:true});
  request();

  if(matchMedia('(max-width:900px), (pointer:coarse)').matches){
    const section=document.querySelector('.tour');
    const sticky=section?.querySelector('.tour-sticky');
    const video=document.getElementById('tourVideo');
    const status=document.getElementById('tourStatus');
    if(section&&sticky){
      let frames=sticky.querySelector('.mobile-tour-frames');
      if(!frames){
        frames=document.createElement('div');
        frames.className='mobile-tour-frames';
        frames.setAttribute('aria-hidden','true');
        sticky.insertBefore(frames,sticky.firstChild);
      }
      if(video){
        try{video.pause();}catch(e){}
        video.removeAttribute('src');
        video.style.display='none';
      }
      if(status)status.textContent='LOADING TOUR';
      fetchParts(['assets/tiny/tour.b64']).then(src=>{
        frames.style.backgroundImage=`url("${src}")`;
        if(status)status.textContent='SCROLL TO MOVE';
      }).catch(()=>{if(status)status.textContent='TOUR UNAVAILABLE';});

      let tourRaf=0;
      const draw=()=>{
        tourRaf=0;
        const r=section.getBoundingClientRect();
        const travel=Math.max(1,section.offsetHeight-innerHeight);
        const amount=Math.min(1,Math.max(0,-r.top/travel));
        const index=Math.min(3,Math.max(0,Math.round(amount*3)));
        frames.style.backgroundPosition=`${index*(100/3)}% 50%`;
      };
      const rq=()=>{if(!tourRaf)tourRaf=requestAnimationFrame(draw);};
      addEventListener('scroll',rq,{passive:true});
      addEventListener('resize',rq,{passive:true});
      draw();
    }
  }
})();
