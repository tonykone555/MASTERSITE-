(()=>{
  const fetchParts=async(paths)=>{const parts=await Promise.all(paths.map(p=>fetch(p,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(p);return r.text()})));return 'data:image/webp;base64,'+parts.join('')};
  const assets={
    stone:['assets/data/stone.1.b64'],
    marble:['assets/data/marble.1.b64'],
    wood:['assets/data/wood.1.b64','assets/data/wood.2.b64'],
    glass:['assets/data/glass.1.b64','assets/data/glass.2.b64']
  };
  const mapping=[['.surface-travertine','stone'],['.surface-marble','marble'],['.surface-oak','wood'],['.surface-glass','glass']];
  mapping.forEach(async([selector,key])=>{const panel=document.querySelector(selector),slab=panel?.querySelector('.surface-slab');if(!slab)return;slab.classList.add('real-slab-mode');let img=slab.querySelector('.real-slab-object');if(!img){img=document.createElement('img');img.className='real-slab-object';img.alt='';img.decoding='async';img.draggable=false;slab.prepend(img)}try{img.src=await fetchParts(assets[key])}catch(e){console.warn('slab asset failed',key)}});

  const panels=[...document.querySelectorAll('.surface-panel:not(.surface-linen)')];let raf=0;const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const updateSlabs=()=>{raf=0;const vh=Math.max(1,innerHeight);panels.forEach((panel,i)=>{const slab=panel.querySelector('.surface-slab.real-slab-mode');if(!slab)return;const r=panel.getBoundingClientRect(),delta=clamp(((r.top+r.height/2)-vh/2)/vh,-1.1,1.1),focus=clamp(1-Math.abs(delta),0,1),dir=i%2?1:-1;slab.style.setProperty('--real-y',`${(delta*26).toFixed(1)}px`);slab.style.setProperty('--real-rx',`${(-delta*1.1).toFixed(2)}deg`);slab.style.setProperty('--real-ry',`${(dir*(1-focus)*.8).toFixed(2)}deg`);slab.style.setProperty('--real-scale',(.975+focus*.035).toFixed(4))})};
  const request=()=>{if(!raf)raf=requestAnimationFrame(updateSlabs)};addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});request();

  if(matchMedia('(max-width:900px), (pointer:coarse)').matches){const section=document.querySelector('.tour'),sticky=section?.querySelector('.tour-sticky'),video=document.getElementById('tourVideo'),status=document.getElementById('tourStatus');if(section&&sticky){let frames=sticky.querySelector('.mobile-tour-frames');if(!frames){frames=document.createElement('div');frames.className='mobile-tour-frames';frames.setAttribute('aria-hidden','true');sticky.insertBefore(frames,sticky.firstChild)}if(video){video.pause();video.style.display='none'}if(status)status.textContent='LOADING TOUR';fetchParts(['assets/data/tour.1.b64','assets/data/tour.2.b64','assets/data/tour.3.b64','assets/data/tour.4.b64']).then(src=>{frames.style.backgroundImage=`url("${src}")`;if(status)status.textContent='SCROLL TO MOVE'}).catch(()=>{if(status)status.textContent='TOUR UNAVAILABLE'});let tourRaf=0;const draw=()=>{tourRaf=0;const r=section.getBoundingClientRect(),travel=Math.max(1,section.offsetHeight-innerHeight),amount=Math.min(1,Math.max(0,-r.top/travel)),index=Math.min(19,Math.max(0,Math.round(amount*19))),col=index%4,row=Math.floor(index/4);frames.style.backgroundPosition=`${col*(100/3)}% ${row*25}%`};const rq=()=>{if(!tourRaf)tourRaf=requestAnimationFrame(draw)};addEventListener('scroll',rq,{passive:true});addEventListener('resize',rq,{passive:true});draw()}}
})();
