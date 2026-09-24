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

const planSheet=document.createElement('link');
planSheet.rel='stylesheet';
planSheet.href='plan-overlay.css?v=frameless-plan-1';
document.head.appendChild(planSheet);

const surfaceSheet=document.createElement('link');
surfaceSheet.rel='stylesheet';
surfaceSheet.href='surface-sections.css?v=structure-3';
document.head.appendChild(surfaceSheet);

const realSlabSheet=document.createElement('link');
realSlabSheet.rel='stylesheet';
realSlabSheet.href='real-slab-images.css?v=real-slabs-2';
document.head.appendChild(realSlabSheet);

setTimeout(()=>{
  const surfaceScript=document.createElement('script');
  surfaceScript.src='surface-sections.js?v=structure-3';
  surfaceScript.async=false;
  surfaceScript.onload=()=>{
    const realScript=document.createElement('script');
    realScript.src='real-slab-runtime.js?v=real-slabs-2';
    realScript.async=false;
    document.body.appendChild(realScript);
  };
  document.body.appendChild(surfaceScript);
},0);
