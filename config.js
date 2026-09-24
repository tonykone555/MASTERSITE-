window.SITE_CONFIG={
  companyName:"AURELIA",
  location:"LONDON · PARIS · MARBELLA",
  email:"studio@aurelia.design",
  headline:"Spaces made to be felt.",
  intro:"Residential interiors shaped through light, material and movement.",
  heroVideo:"https://videos.pexels.com/video-files/7239168/7239168-uhd_2160_3840_25fps.mp4",
  tourVideo:"https://videos.pexels.com/video-files/7239168/7239168-uhd_2160_3840_25fps.mp4",
  poster:"https://images.unsplash.com/photo-1758957701419-2c6e266f7988?auto=format&fit=crop&fm=jpg&q=84&w=2200"
};

/* Load the material-corridor/mobile experience layer after the stable core. */
const experienceStyles=document.createElement('link');
experienceStyles.rel='stylesheet';
experienceStyles.href='experience-fixes.css';
document.head.appendChild(experienceStyles);
window.addEventListener('load',()=>{
  const experienceScript=document.createElement('script');
  experienceScript.src='mobile-experience.js';
  experienceScript.defer=true;
  document.body.appendChild(experienceScript);
},{once:true});
