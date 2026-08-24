/* Romantic birthday interactions + high-performance Canvas particle field */
const CONFIG = { name: "Lina Madam", particleCount: 150, heartBurstCount: 26 };
const nameEl = document.getElementById("name");
const modalName = document.getElementById("modalName");
const cake = document.getElementById("cake");
const wishBtn = document.getElementById("wishBtn");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
nameEl.textContent = CONFIG.name;
modalName.textContent = CONFIG.name;
window.addEventListener("load", () => setTimeout(() => document.body.classList.remove("not-loaded"), 700));

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: true });
let dpr = Math.min(window.devicePixelRatio || 1, 2), width = 0, height = 0;
let particles = [], bursts = [];
function resize(){ dpr=Math.min(window.devicePixelRatio||1,2); width=innerWidth; height=innerHeight; canvas.width=Math.floor(width*dpr); canvas.height=Math.floor(height*dpr); canvas.style.width=width+"px"; canvas.style.height=height+"px"; ctx.setTransform(dpr,0,0,dpr,0,0); }
function random(a,b){ return Math.random()*(b-a)+a; }
function createParticle(){ return {x:random(0,width),y:random(0,height),r:random(.45,1.8),speed:random(.05,.35),drift:random(-.18,.18),phase:random(0,Math.PI*2),alpha:random(.15,.75),twinkle:random(.008,.03),kind:Math.random()>.9?"heart":"dot"}; }
function resetParticles(){ particles=Array.from({length:CONFIG.particleCount},createParticle); }
function drawHeart(x,y,size,alpha){ ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); ctx.beginPath(); ctx.moveTo(0,size*.35); ctx.bezierCurveTo(-size*.65,-size*.15,-size*.55,-size*.7,0,-size*.35); ctx.bezierCurveTo(size*.55,-size*.7,size*.65,-size*.15,0,size*.35); ctx.fillStyle="#ff6da9"; ctx.shadowColor="#ff4f9a"; ctx.shadowBlur=9; ctx.fill(); ctx.restore(); }
function animate(time){
  ctx.clearRect(0,0,width,height);
  for(const p of particles){
    p.y-=p.speed; p.x+=Math.sin(time*.0004+p.phase)*p.drift; p.phase+=p.twinkle;
    if(p.y<-10){p.y=height+10;p.x=random(0,width);}
    const a=Math.max(.08,p.alpha+Math.sin(p.phase)*.15);
    if(p.kind==="heart") drawHeart(p.x,p.y,p.r*4,a);
    else {ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,210,236,${a})`;ctx.shadowColor="rgba(255,115,183,.65)";ctx.shadowBlur=7;ctx.fill();}
  }
  for(let i=bursts.length-1;i>=0;i--){const b=bursts[i];b.x+=b.vx;b.y+=b.vy;b.vy+=.045;b.life-=.016;b.rotation+=b.spin;ctx.save();ctx.globalAlpha=Math.max(0,b.life);ctx.translate(b.x,b.y);ctx.rotate(b.rotation);if(b.kind==="heart")drawHeart(0,0,b.size,1);else{ctx.fillStyle="#ffd166";ctx.fillRect(-b.size/2,-b.size/2,b.size,b.size);}ctx.restore();if(b.life<=0)bursts.splice(i,1);}
  requestAnimationFrame(animate);
}
function heartBurst(x,y,count=CONFIG.heartBurstCount){for(let i=0;i<count;i++){const angle=random(0,Math.PI*2),speed=random(1,4.5);bursts.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-1.5,size:random(2,6),life:random(.8,1.5),rotation:random(-.5,.5),spin:random(-.08,.08),kind:Math.random()>.3?"heart":"spark"});}}
resize();resetParticles();requestAnimationFrame(animate);addEventListener("resize",()=>{resize();resetParticles();});

let blown=false;
cake.addEventListener("click",()=>{blown=!blown;cake.classList.toggle("cake-blown",blown);const r=cake.getBoundingClientRect();heartBurst(r.left+r.width/2,r.top+r.height*.45,38);showToast(blown?"Wish sent into the stars ✨":"The candles are glowing again ♥");});

wishBtn.addEventListener("click",()=>{modal.classList.add("open");modal.setAttribute("aria-hidden","false");heartBurst(innerWidth/2,innerHeight/2,65);});
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
closeBtn.addEventListener("click",closeModal);modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

let toastTimer;
function showToast(text){let toast=document.querySelector(".birthday-toast");if(!toast){toast=document.createElement("div");toast.className="birthday-toast";document.body.appendChild(toast);}toast.textContent=text;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2200);}
const toastStyle=document.createElement("style");toastStyle.textContent=`.birthday-toast{position:fixed;left:50%;bottom:34px;transform:translate(-50%,20px);z-index:150;padding:11px 18px;border-radius:999px;color:#fff;background:rgba(25,7,31,.78);border:1px solid rgba(255,140,199,.42);backdrop-filter:blur(12px);box-shadow:0 10px 35px rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:.35s ease;font:13px Georgia,serif}.birthday-toast.show{opacity:1;transform:translate(-50%,0)}`;document.head.appendChild(toastStyle);
