const cfg=window.SITE_CONFIG||{};
const DEFAULT_VIDEO='https://videos.pexels.com/video-files/7239168/7239168-uhd_2160_3840_25fps.mp4';
const DEFAULT_POSTER='https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&fm=jpg&q=84&w=2200';

const enhancementSheet=document.createElement('link');
enhancementSheet.rel='stylesheet';
enhancementSheet.href='enhancements.css';
document.head.appendChild(enhancementSheet);

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

function chapterFor(amount){if(amount<.24)return 0;if(amount<.49)return 1;if(amount<.74)return 2;return 3;}
function showChapter(next){if(next===active)return;active=next;chapters.forEach((el,i)=>el.classList.toggle('is-active',i===next));}
function scrollAmount(){const rect=section.getBoundingClientRect();const travel=Math.max(1,section.offsetHeight-window.innerHeight);return Math.min(1,Math.max(0,-rect.top/travel));}
function syncTarget(){const amount=scrollAmount();const safeDuration=Math.max(.1,(duration||16)-.08);targetTime=amount*safeDuration;progress.style.transform=`scaleX(${amount})`;showChapter(chapterFor(amount));if(!raf)raf=requestAnimationFrame(render);}
function render(now){raf=0;const diff=targetTime-displayTime;displayTime+=diff*(Math.abs(diff)>1.2?.28:.18);if(videoReady&&Number.isFinite(displayTime)){if(now-lastWrite>30||Math.abs(diff)<.03){lastWrite=now;const next=Math.min(Math.max(displayTime,0),Math.max(.1,duration-.06));if(Math.abs(tourVideo.currentTime-next)>.018){try{tourVideo.currentTime=next;}catch{}}}}if(Math.abs(targetTime-displayTime)>.006)raf=requestAnimationFrame(render);}
function markReady(){duration=Number.isFinite(tourVideo.duration)&&tourVideo.duration>0?tourVideo.duration:16;videoReady=true;tourVideo.pause();status.textContent='SCROLL TO EXPLORE';syncTarget();}
tourVideo.addEventListener('loadedmetadata',markReady,{once:true});
tourVideo.addEventListener('canplay',()=>{if(!videoReady)markReady();},{once:true});
tourVideo.addEventListener('error',()=>{status.textContent='VIDEO UNAVAILABLE';});
tourVideo.load();

let scrollTick=0;
addEventListener('scroll',()=>{if(scrollTick)return;scrollTick=requestAnimationFrame(()=>{scrollTick=0;syncTarget();});},{passive:true});
addEventListener('resize',syncTarget,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){tourVideo.pause();syncTarget();}});
syncTarget();

const spatialSections=[
{id:'top',label:'Entrance',x:9,y:79},{id:'studio',label:'Approach',x:29,y:79},{id:'experience',label:'The space',x:47,y:79},{id:'materials',label:'Materials',x:47,y:42},{id:'projects',label:'Projects',x:68,y:42},{id:'process',label:'Process',x:85,y:42},{id:'services',label:'Services',x:85,y:18},{id:'contact',label:'Contact',x:95,y:18}
];
document.querySelector('.material-section').id='materials';
document.querySelector('.process-section').id='process';
document.querySelector('.services').id='services';

const nav=document.querySelector('.nav');
nav.insertAdjacentHTML('afterend',`<aside class="floorplan-nav is-hidden" id="floorplanNav" aria-label="Architectural site map"><div class="plan-meta"><span>You are here</span><span class="plan-room" id="planRoom">Entrance</span></div><div class="plan-canvas"><svg viewBox="0 0 240 126" preserveAspectRatio="none" aria-hidden="true"><path class="plan-wall" d="M4 98H104V54H164V18H236V118H126V98H4Z"/><path d="M48 98V118M82 98V118M104 76H126M126 54V98M164 18V54M198 18V54M164 54V78H236M198 78V118"/><path class="plan-door" d="M99 82c12 0 22 10 22 22M157 48c0 11 9 20 20 20M193 73c11 0 20 9 20 20"/></svg><span class="plan-dot" id="planDot"></span>${spatialSections.map((s,i)=>`<button class="plan-node" data-map-index="${i}" style="left:${s.x}%;top:${s.y}%" aria-label="Go to ${s.label}"><span>${s.label}</span></button>`).join('')}</div><div class="plan-progress"><span>01</span><div><i id="siteProgress"></i></div><span>08</span></div></aside>`);

const floorplan=document.getElementById('floorplanNav');
const planDot=document.getElementById('planDot');
const planRoom=document.getElementById('planRoom');
const siteProgress=document.getElementById('siteProgress');
const planButtons=[...document.querySelectorAll('.plan-node')];
planButtons.forEach((button,i)=>button.addEventListener('click',()=>document.getElementById(spatialSections[i].id)?.scrollIntoView({behavior:'smooth'})));

function updateFloorplan(){const pageProgress=Math.min(1,Math.max(0,window.scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));siteProgress.style.transform=`scaleX(${pageProgress})`;floorplan.classList.toggle('is-hidden',window.scrollY<innerHeight*.28);floorplan.classList.toggle('is-near-contact',document.getElementById('contact').getBoundingClientRect().top<innerHeight*.72);const focusY=innerHeight*.47;let closest=0,closestDistance=Infinity;spatialSections.forEach((s,i)=>{const el=document.getElementById(s.id);if(!el)return;const r=el.getBoundingClientRect();const contains=focusY>=r.top&&focusY<=r.bottom;const distance=contains?0:Math.min(Math.abs(r.top-focusY),Math.abs(r.bottom-focusY));if(distance<closestDistance){closestDistance=distance;closest=i;}});const s=spatialSections[closest];planDot.style.left=s.x+'%';planDot.style.top=s.y+'%';planRoom.textContent=s.label;planButtons.forEach((b,i)=>b.classList.toggle('is-active',i===closest));}

function makeThreshold(afterSelector,{index,label,title,subtitle,image}){const anchor=document.querySelector(afterSelector);if(!anchor)return null;const el=document.createElement('section');el.className='threshold';el.innerHTML=`<div class="threshold-sticky"><div class="threshold-bg" style="background-image:url('${image}')"></div><div class="threshold-shade"></div><div class="threshold-frame"></div><div class="threshold-door left"></div><div class="threshold-door right"></div><div class="threshold-copy"><span>${label}</span><h2>${title}</h2><small>${subtitle}</small></div><span class="threshold-index">${index}</span></div>`;anchor.insertAdjacentElement('afterend',el);return el;}

const thresholds=[
makeThreshold('.approach',{index:'01 / 03',label:'THRESHOLD',title:'Enter the space',subtitle:'SCROLL THROUGH',image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=82'}),
makeThreshold('.material-section',{index:'02 / 03',label:'THRESHOLD',title:'From material to place',subtitle:'SELECTED WORK AHEAD',image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=82'}),
makeThreshold('.services',{index:'03 / 03',label:'THRESHOLD',title:'A different perspective',subtitle:'MOVE INTO THE NEXT FRAME',image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=82'})
].filter(Boolean);
function updateThresholds(){thresholds.forEach(el=>{const rect=el.getBoundingClientRect();const travel=Math.max(1,el.offsetHeight-innerHeight);const amount=Math.min(1,Math.max(0,-rect.top/travel));const open=Math.min(1,Math.max(0,amount*1.55));el.style.setProperty('--door-open',open.toFixed(4));const bg=el.querySelector('.threshold-bg');if(bg)bg.style.transform=`scale(${1.05+open*.035})`;});}

const materialSection=document.querySelector('.material-section');
materialSection.classList.add('material-explorer');
const materialData=[
{name:'Natural stone',image:'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2000&q=84',description:'Weight, permanence and subtle variation. Stone grounds the room and lets changing light do the decoration.',tags:['Travertine','Limestone','Honed'],related:'Sculpted living',bg:'#d8cfc2'},
{name:'Oak & timber',image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=84',description:'Warm grain and precise joinery bring softness to architectural lines without losing clarity.',tags:['Natural oak','Walnut','Joinery'],related:'Quiet composition',bg:'#c9bca9'},
{name:'Glass & light',image:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=84',description:'Reflection, transparency and daylight are treated as materials in their own right, extending depth beyond the walls.',tags:['Fluted glass','Daylight','Reflection'],related:'Vertical light',bg:'#d8d8d2'},
{name:'Metal detail',image:'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?auto=format&fit=crop&w=2000&q=84',description:'Used sparingly, metal creates a precise edge: a handle, frame or shadow line that sharpens the whole composition.',tags:['Bronze','Blackened steel','Brushed'],related:'Soft geometry',bg:'#c8c4bc'},
{name:'Soft tactility',image:'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=2000&q=84',description:'Textiles absorb sound, soften contrast and make restrained architecture feel human rather than clinical.',tags:['Linen','Wool','Bouclé'],related:'Living frame',bg:'#ddd5ca'}
];
const oldGrid=materialSection.querySelector('.material-grid');
oldGrid.insertAdjacentHTML('afterend',`<div class="material-map" id="materialMap"><div class="material-list">${materialData.map((m,i)=>`<button class="material-choice${i===0?' is-active':''}" data-material="${i}"><span class="num">0${i+1}</span><span class="name">${m.name}</span><svg viewBox="0 0 48 20"><use href="#arrow-right"/></svg></button>`).join('')}</div><div class="material-stage"><div class="material-stage-media"><img class="material-stage-image" id="materialStageImage" src="${materialData[0].image}" alt="${materialData[0].name}"></div><div class="material-related"><b>Related project</b><span id="materialRelated">${materialData[0].related}</span></div><div class="material-stage-copy"><div class="material-stage-title"><small>MATERIAL / 01</small><h3 id="materialStageTitle">${materialData[0].name}</h3></div><div class="material-stage-info"><p id="materialDescription">${materialData[0].description}</p><div class="material-tags" id="materialTags">${materialData[0].tags.map(t=>`<span>${t}</span>`).join('')}</div></div></div></div></div>`);

const materialMap=document.getElementById('materialMap');
const materialImage=document.getElementById('materialStageImage');
const materialTitle=document.getElementById('materialStageTitle');
const materialDescription=document.getElementById('materialDescription');
const materialTags=document.getElementById('materialTags');
const materialRelated=document.getElementById('materialRelated');
const materialKicker=materialMap.querySelector('.material-stage-title small');
const materialChoices=[...materialMap.querySelectorAll('.material-choice')];
let materialTimer=0;
function selectMaterial(index){const m=materialData[index];if(!m)return;clearTimeout(materialTimer);materialMap.classList.add('is-changing');materialChoices.forEach((b,i)=>b.classList.toggle('is-active',i===index));materialSection.style.setProperty('--material-bg',m.bg);materialTimer=setTimeout(()=>{materialImage.src=m.image;materialImage.alt=m.name;materialTitle.textContent=m.name;materialDescription.textContent=m.description;materialRelated.textContent=m.related;materialKicker.textContent=`MATERIAL / 0${index+1}`;materialTags.innerHTML=m.tags.map(t=>`<span>${t}</span>`).join('');materialMap.classList.remove('is-changing');},140);}
materialChoices.forEach((button,i)=>{button.addEventListener('click',()=>selectMaterial(i));button.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)selectMaterial(i);});});

let spatialTick=0;
function updateSpatial(){updateFloorplan();updateThresholds();}
addEventListener('scroll',()=>{if(spatialTick)return;spatialTick=requestAnimationFrame(()=>{spatialTick=0;updateSpatial();});},{passive:true});
addEventListener('resize',updateSpatial,{passive:true});
updateSpatial();
