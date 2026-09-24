(()=>{
  const materialSection=document.querySelector('.material-section');
  if(materialSection){
    materialSection.id='materials';
    materialSection.innerHTML=`
      <div class="surface-stack" aria-label="Material atmosphere chapters">
        <section class="surface-panel surface-travertine"><div class="surface-slab"><span class="surface-index">01 / 05</span><div class="surface-copy"><div><small>ATMOSPHERE / WEIGHT</small><h2>Spaces begin with what feels permanent.</h2></div><p>Mass, proportion and quiet texture give a room its first sense of calm before furniture or decoration is introduced.</p></div></div></section>
        <section class="surface-panel surface-marble light-copy"><div class="surface-slab"><span class="surface-index">02 / 05</span><div class="surface-copy"><div><small>ATMOSPHERE / VEIN</small><h2>Detail should feel discovered, not applied.</h2></div><p>Subtle variation creates character without noise. The surface becomes part of the composition rather than an accessory to it.</p></div></div></section>
        <section class="surface-panel surface-oak"><div class="surface-slab"><span class="surface-index">03 / 05</span><div class="surface-copy"><div><small>ATMOSPHERE / TOUCH</small><h2>Warmth comes from what the hand remembers.</h2></div><p>Natural grain, joinery and tactility soften strong architectural lines and make restraint feel lived in.</p></div></div></section>
        <section class="surface-panel surface-glass"><div class="surface-slab"><span class="surface-index">04 / 05</span><div class="surface-copy"><div><small>ATMOSPHERE / LIGHT</small><h2>Light is allowed to become part of the room.</h2></div><p>Transparency, reflection and shadow extend the space beyond its physical edges and change it throughout the day.</p></div></div></section>
        <section class="surface-panel surface-linen light-copy"><div class="surface-slab"><span class="surface-index">05 / 05</span><div class="surface-copy"><div><small>ATMOSPHERE / SOFTNESS</small><h2>Comfort belongs in the architecture itself.</h2></div><p>Softness, acoustics and gentle contrast complete the transition from designed object to inhabitable place.</p></div></div></section>
      </div>`;
  }

  const mq=matchMedia('(max-width:900px), (pointer:coarse)');
  if(!mq.matches)return;
  const section=document.querySelector('.tour');
  const video=document.getElementById('tourVideo');
  const status=document.getElementById('tourStatus');
  if(!section||!video)return;

  video.muted=true;
  video.playsInline=true;
  video.setAttribute('playsinline','');
  video.setAttribute('webkit-playsinline','');
  video.setAttribute('disablepictureinpicture','');
  video.preload='auto';
  section.classList.add('needs-mobile-unlock');

  let unlocked=false;
  let mobileRaf=0;
  let mobileDuration=0;

  const amount=()=>{
    const rect=section.getBoundingClientRect();
    const travel=Math.max(1,section.offsetHeight-innerHeight);
    return Math.min(1,Math.max(0,-rect.top/travel));
  };

  const seek=()=>{
    mobileRaf=0;
    if(!unlocked||!mobileDuration||video.readyState<1)return;
    const next=Math.min(Math.max(amount()*(mobileDuration-.08),0),Math.max(.05,mobileDuration-.08));
    try{
      if(typeof video.fastSeek==='function'&&Math.abs(video.currentTime-next)>.12)video.fastSeek(next);
      else if(Math.abs(video.currentTime-next)>.035)video.currentTime=next;
    }catch(e){}
  };

  const requestSeek=()=>{if(!mobileRaf)mobileRaf=requestAnimationFrame(seek);};

  async function unlock(){
    if(unlocked)return;
    try{
      const p=video.play();
      if(p&&typeof p.then==='function')await p;
      await new Promise(r=>setTimeout(r,60));
      video.pause();
      mobileDuration=Number.isFinite(video.duration)&&video.duration>0?video.duration:16;
      unlocked=true;
      section.classList.remove('needs-mobile-unlock');
      section.classList.add('mobile-unlocked');
      if(status)status.textContent='SCROLL TO MOVE';
      try{video.currentTime=Math.max(.01,amount()*(mobileDuration-.08));}catch(e){}
      requestSeek();
    }catch(e){
      if(status)status.textContent='TOUCH TO ENABLE';
    }
  }

  video.addEventListener('loadedmetadata',()=>{
    mobileDuration=Number.isFinite(video.duration)&&video.duration>0?video.duration:16;
    requestSeek();
  });
  video.addEventListener('loadeddata',()=>{if(unlocked)requestSeek();});
  video.addEventListener('canplay',()=>{if(unlocked)requestSeek();});
  section.addEventListener('touchstart',unlock,{once:false,passive:true});
  section.addEventListener('pointerdown',unlock,{once:false,passive:true});
  addEventListener('scroll',requestSeek,{passive:true});
  addEventListener('resize',requestSeek,{passive:true});
  video.load();
})();
