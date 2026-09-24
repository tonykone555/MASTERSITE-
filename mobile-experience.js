(() => {
  const materialSection=document.querySelector('.material-section');
  if(materialSection){
    const slabs=[
      {name:'Travertine',type:'STONE / 01',image:'https://images.pexels.com/photos/4709013/pexels-photo-4709013.jpeg?auto=compress&cs=tinysrgb&w=1800',description:'A warm, porous stone with visible movement and natural variation. The surface becomes the atmosphere rather than a decorative layer.',tags:['Honed','Warm','Mineral']},
      {name:'Calacatta marble',type:'STONE / 02',image:'https://images.pexels.com/photos/6634146/pexels-photo-6634146.jpeg?auto=compress&cs=tinysrgb&w=1800',description:'Large veining turns the wall into a single architectural gesture. Used as a slab, not a pattern.',tags:['Marble','Vein','Polished']},
      {name:'Natural oak',type:'TIMBER / 03',image:'https://images.pexels.com/photos/37225886/pexels-photo-37225886.jpeg?auto=compress&cs=tinysrgb&w=1800',description:'A continuous timber plane adds warmth and grain. The panel itself becomes a room-defining surface.',tags:['Oak','Grain','Joinery']},
      {name:'Window glass',type:'OPENING / 04',image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=84',description:'The material disappears and the opening takes over. Glass, reflection and daylight become the next room.',tags:['Glass','Light','Reflection']},
      {name:'Linen',type:'TEXTILE / 05',image:'https://images.pexels.com/photos/8774406/pexels-photo-8774406.jpeg?auto=compress&cs=tinysrgb&w=1800',description:'Soft woven texture absorbs sound and contrast, giving the final space a quieter, more tactile edge.',tags:['Linen','Soft','Acoustic']}
    ];
    const intro=materialSection.querySelector('.material-intro');
    const corridor=document.createElement('div');
    corridor.className='slab-corridor';
    corridor.innerHTML=`<div class="slab-corridor-head"><small>MOVE THROUGH THE MATERIALS</small><p>Each surface becomes a room. Swipe or select a slab to move from stone to marble, timber, glass and textile.</p></div><div class="slab-track" id="slabTrack">${slabs.map((s,i)=>`<button class="slab${i===0?' is-active':''}" data-slab="${i}" style="--slab-image:url('${s.image}')" aria-label="Explore ${s.name}"><span class="slab-number">0${i+1}</span><span class="slab-type">${s.type}</span><span class="slab-name">${s.name}</span></button>`).join('')}</div><div class="slab-progress"><span>01</span><div class="slab-progress-line"><i id="slabProgress"></i></div><span>05</span></div><div class="slab-detail"><div><h3 id="slabTitle">${slabs[0].name}</h3><div class="slab-tags" id="slabTags">${slabs[0].tags.map(t=>`<span>${t}</span>`).join('')}</div></div><p id="slabDescription">${slabs[0].description}</p></div>`;
    (intro||materialSection.firstElementChild).insertAdjacentElement('afterend',corridor);

    const track=document.getElementById('slabTrack');
    const cards=[...track.querySelectorAll('.slab')];
    const title=document.getElementById('slabTitle');
    const desc=document.getElementById('slabDescription');
    const tags=document.getElementById('slabTags');
    const bar=document.getElementById('slabProgress');
    let current=-1;
    function activate(index,scroll=false){
      if(index<0||index>=slabs.length)return;
      current=index;
      const s=slabs[index];
      cards.forEach((c,i)=>c.classList.toggle('is-active',i===index));
      materialSection.style.setProperty('--slab-bg',`url('${s.image}')`);
      title.textContent=s.name; desc.textContent=s.description;
      tags.innerHTML=s.tags.map(t=>`<span>${t}</span>`).join('');
      bar.style.transform=`translateX(${index*100}%)`;
      if(scroll)cards[index].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    }
    cards.forEach((card,i)=>{
      card.addEventListener('click',()=>activate(i,matchMedia('(max-width:900px)').matches));
      card.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)activate(i,false);});
    });
    let slabRaf=0;
    track.addEventListener('scroll',()=>{
      if(slabRaf)return;
      slabRaf=requestAnimationFrame(()=>{
        slabRaf=0;
        if(!matchMedia('(max-width:900px)').matches)return;
        const center=track.scrollLeft+track.clientWidth/2;
        let best=0,dist=Infinity;
        cards.forEach((c,i)=>{const d=Math.abs((c.offsetLeft+c.offsetWidth/2)-center);if(d<dist){dist=d;best=i;}});
        if(best!==current)activate(best,false);
      });
    },{passive:true});
    activate(0,false);
  }

  const tour=document.querySelector('.tour');
  const sticky=document.querySelector('.tour-sticky');
  const video=document.getElementById('tourVideo');
  if(tour&&sticky&&video&&matchMedia('(max-width:900px)').matches){
    sticky.classList.add('is-mobile-tour');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.setAttribute('muted','');
    video.muted=true;
    video.controls=false;
    if(window.SITE_CONFIG?.mobileTourVideo&&video.src!==window.SITE_CONFIG.mobileTourVideo){video.src=window.SITE_CONFIG.mobileTourVideo;video.load();}
    const poster=video.poster||'https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&w=1400&q=80';
    sticky.style.backgroundImage=`linear-gradient(rgba(0,0,0,.12),rgba(0,0,0,.28)),url('${poster}')`;
    sticky.style.backgroundSize='cover';
    sticky.style.backgroundPosition='center';
    const unlock=document.createElement('button');
    unlock.type='button';unlock.className='mobile-tour-unlock';unlock.innerHTML='Touch + scroll<br>to move';
    sticky.appendChild(unlock);
    let unlocked=false;
    function markVisible(){sticky.classList.add('mobile-video-ready');unlock.classList.add('is-unlocked');}
    function unlockVideo(){
      if(unlocked)return;
      video.muted=true;
      const play=video.play();
      if(play&&typeof play.then==='function')play.then(()=>{video.pause();unlocked=true;markVisible();window.dispatchEvent(new Event('scroll'));}).catch(()=>{video.load();});
      else {video.pause();unlocked=true;markVisible();window.dispatchEvent(new Event('scroll'));}
    }
    video.addEventListener('loadeddata',()=>{sticky.classList.add('mobile-video-ready');},{once:true});
    video.addEventListener('loadedmetadata',()=>{try{if(video.currentTime===0)video.currentTime=.01;}catch{}},{once:true});
    unlock.addEventListener('click',unlockVideo);
    tour.addEventListener('touchstart',unlockVideo,{passive:true,once:true});
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){video.load();}});},{rootMargin:'100% 0px'});
    io.observe(tour);
  }
})();
