const cfg=window.SITE_CONFIG||{};
if(cfg.companyName)document.querySelectorAll('[data-company]').forEach(el=>el.textContent=cfg.companyName);
if(cfg.location)document.querySelectorAll('[data-location]').forEach(el=>el.textContent=cfg.location);
if(cfg.headline){const el=document.querySelector('[data-headline]');if(el)el.textContent=cfg.headline;}
if(cfg.intro){const el=document.querySelector('[data-intro]');if(el)el.textContent=cfg.intro;}
if(cfg.email)document.querySelectorAll('[data-email]').forEach(el=>{el.href='mailto:'+cfg.email;const s=el.querySelector('span');if(s)s.textContent=cfg.email;});

const projects=[
['https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&fm=jpg&q=82&w=1800','Sculpted living','Material · Light · Art'],
['https://images.unsplash.com/photo-1771888703723-01d85da1dae1?auto=format&fit=crop&fm=jpg&q=82&w=1800','Quiet composition','Texture · Oak · Restraint'],
['https://images.unsplash.com/photo-1776362355123-ca966d36e29c?auto=format&fit=crop&fm=jpg&q=82&w=1800','Vertical light','Volume · Stone · Glow'],
['https://images.unsplash.com/photo-1760072513442-9872656c1b07?auto=format&fit=crop&fm=jpg&q=82&w=1800','Soft geometry','Joinery · Warmth · Detail'],
['https://images.unsplash.com/photo-1771371428960-35a50c2d4e7c?auto=format&fit=crop&fm=jpg&q=82&w=1800','Living frame','Flow · Framing · Rhythm'],
['https://images.unsplash.com/photo-1758448756362-e323282ccbcc?auto=format&fit=crop&fm=jpg&q=82&w=1800','Threshold garden','Stone · Water · Light']
];
const grid=document.getElementById('projectGrid');
projects.forEach((p,i)=>{const a=document.createElement('article');a.className='project';a.innerHTML=`<div class="photo"><img src="${p[0]}" alt="${p[1]}"><span>${String(i+1).padStart(2,'0')}</span></div><div class="project-copy"><small>PRIVATE RESIDENCE · ${String(i+1).padStart(2,'0')}</small><h3>${p[1]}</h3><p>${p[2]}</p></div>`;grid.appendChild(a)});

const section=document.querySelector('.tour'),video=document.getElementById('tourVideo'),ambient=document.getElementById('tourAmbient'),progress=document.getElementById('tourProgress'),chapters=[...document.querySelectorAll('.chapter')];
let target=0,rendered=0,raf=0,active=0;
function showChapter(next){if(next===active)return;active=next;chapters.forEach((el,i)=>el.classList.toggle('is-active',i===next));}
function tick(){raf=0;const d=target-rendered;rendered+=d*(Math.abs(d)>.9?.20:.115);if(video.readyState>=2&&Math.abs(video.currentTime-rendered)>.012){try{video.currentTime=rendered}catch{}}if(ambient.readyState>=2&&Math.abs(ambient.currentTime-rendered)>.04){try{ambient.currentTime=rendered}catch{}}if(Math.abs(target-rendered)>.004)raf=requestAnimationFrame(tick)}
function measure(){const r=section.getBoundingClientRect(),travel=Math.max(1,section.offsetHeight-innerHeight),amount=Math.min(1,Math.max(0,-r.top/travel)),duration=((Number.isFinite(video.duration)&&video.duration>0)?video.duration:16)-.05;target=amount*Math.max(.1,duration);progress.style.transform=`scaleX(${amount})`;showChapter(amount<.31?0:amount<.66?1:2);if(!raf)raf=requestAnimationFrame(tick)}
function ready(){video.pause();ambient.pause();measure()}video.addEventListener('loadedmetadata',ready);ambient.addEventListener('loadedmetadata',ready);addEventListener('scroll',measure,{passive:true});addEventListener('resize',measure,{passive:true});measure();