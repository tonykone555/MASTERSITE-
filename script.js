const cfg=window.SITE_CONFIG||{};
const DEFAULT_VIDEO='https://videos.pexels.com/video-files/7239168/7239168-uhd_2160_3840_25fps.mp4';
const DEFAULT_POSTER='https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&fm=jpg&q=84&w=2200';

if(cfg.companyName)document.querySelectorAll('[data-company]').forEach(el=>el.textContent=cfg.companyName);
if(cfg.location)document.querySelectorAll('[data-location]').forEach(el=>el.textContent=cfg.location);
if(cfg.headline){const el=document.querySelector('[data-headline]');if(el)el.textContent=cfg.headline;}
if(cfg.intro){const el=document.querySelector('[data-intro]');if(el)el.textContent=cfg.intro;}
if(cfg.email)document.querySelectorAll('[data-email]').forEach(el=>{el.href='mailto:'+cfg.email;const s=el.querySelector('span');if(s)s.textContent=cfg.email;});

const heroVideo=document.getElementById('heroVideo');
const tourVideo=document.getElementById('tourVideo');
const heroSrc=cfg.heroVideo||DEFAULT_VIDEO;
const tourSrc=cfg.tourVideo||heroSrc;
heroVideo.src=heroSrc;
tourVideo.src=tourSrc;
if(cfg.poster){heroVideo.poster=cfg.poster;tourVideo.poster=cfg.poster;}

const projects=[
['https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&fm=jpg&q=82&w=1800','Sculpted living','Material · Light · Art'],
['https://images.unsplash.com/photo-1771888703723-01d85da1dae1?auto=format&fit=crop&fm=jpg&q=82&w=1800','Quiet composition','Texture · Oak · Restraint'],
['https://images.unsplash.com/photo-1776362355123-ca966d36e29c?auto=format&fit=crop&fm=jpg&q=82&w=1800','Vertical light','Volume · Stone · Glow'],
['https://images.unsplash.com/photo-1760072513442-9872656c1b07?auto=format&fit=crop&fm=jpg&q=82&w=1800','Soft geometry','Joinery · Warmth · Detail'],
['https://images.unsplash.com/photo-1771371428960-35a50c2d4e7c?auto=format&fit=crop&fm=jpg&q=82&w=1800','Living frame','Flow · Framing · Rhythm'],
['https://images.unsplash.com/photo-1758448756362-e323282ccbcc?auto=format&fit=crop&fm=jpg&q=82&w=1800','Threshold garden','Stone · Water · Light']
];
const grid=document.getElementById('projectGrid');
projects.forEach((p,i)=>{const a=document.createElement('article');a.className='project';a.innerHTML=`<div class="photo"><img src="${p[0]}" alt="${p[1]}" loading="lazy"><span>${String(i+1).padStart(2,'0')}</span></div><div class="project-copy"><small>PRIVATE RESIDENCE · ${String(i+1).padStart(2,'0')}</small><h3>${p[1]}</h3><p>${p[2]}</p></div>`;grid.appendChild(a);});

const section=document.querySelector('.tour');
const progress=document.getElementById('tourProgress');
const status=document.getElementById('tourStatus');
const chapters=[...document.querySelectorAll('.chapter')];
let duration=0,targetTime=0,displayTime=0,raf=0,active=-1,lastWrite=0,videoReady=false;

function chapterFor(amount){
  if(amount<.24)return 0;
  if(amount<.49)return 1;
  if(amount<.74)return 2;
  return 3;
}
function showChapter(next){
  if(next===active)return;
  active=next;
  chapters.forEach((el,i)=>el.classList.toggle('is-active',i===next));
}
function scrollAmount(){
  const rect=section.getBoundingClientRect();
  const travel=Math.max(1,section.offsetHeight-window.innerHeight);
  return Math.min(1,Math.max(0,-rect.top/travel));
}
function syncTarget(){
  const amount=scrollAmount();
  const safeDuration=Math.max(.1,(duration||16)-.08);
  targetTime=amount*safeDuration;
  progress.style.transform=`scaleX(${amount})`;
  showChapter(chapterFor(amount));
  if(!raf)raf=requestAnimationFrame(render);
}
function render(now){
  raf=0;
  const diff=targetTime-displayTime;
  displayTime+=diff*(Math.abs(diff)>1.2?.28:.18);

  if(videoReady&&Number.isFinite(displayTime)){
    if(now-lastWrite>30||Math.abs(diff)<.03){
      lastWrite=now;
      const next=Math.min(Math.max(displayTime,0),Math.max(.1,duration-.06));
      if(Math.abs(tourVideo.currentTime-next)>.018){
        try{tourVideo.currentTime=next;}catch{}
      }
    }
  }
  if(Math.abs(targetTime-displayTime)>.006)raf=requestAnimationFrame(render);
}
function markReady(){
  duration=Number.isFinite(tourVideo.duration)&&tourVideo.duration>0?tourVideo.duration:16;
  videoReady=true;
  tourVideo.pause();
  status.textContent='SCROLL TO EXPLORE';
  syncTarget();
}
tourVideo.addEventListener('loadedmetadata',markReady,{once:true});
tourVideo.addEventListener('canplay',()=>{if(!videoReady)markReady();},{once:true});
tourVideo.addEventListener('error',()=>{status.textContent='VIDEO UNAVAILABLE';});
tourVideo.load();

let scrollTick=0;
addEventListener('scroll',()=>{
  if(scrollTick)return;
  scrollTick=requestAnimationFrame(()=>{scrollTick=0;syncTarget();});
},{passive:true});
addEventListener('resize',syncTarget,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){tourVideo.pause();syncTarget();}});
syncTarget();
