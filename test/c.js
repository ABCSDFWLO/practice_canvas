const cv=document.getElementById("cav");
const div=document.getElementById("div");
const ctx= cv.getContext("2d");
let raf=0;
const BED=100;

function draw(ctx){
  ctx.save();
  ctx.fillStyle='black';
  ctx.fillRect(0,0,cv.width,cv.height);
  
  ctx.strokeStyle='red';
  ctx.beginPath();
  ctx.arc(BED*0.5,BED*0.5,30,0,6.28);
  ctx.stroke();
  ctx.restore();
}


window.addEventListener('resize',e=>{
  const ch=cv.parentElement.clientHeight;
  const cw=cv.parentElement.clientWidth;
  const ratio=ch>cw?cw/BED:ch/BED;
  cv.height=ch;
  cv.width=cw;
  ctx.save();
  ctx.translate(ch>cw?0:(cw-ch)*0.5,ch>cw?(ch-cw)*0.5:0);
  ctx.scale(ratio,ratio);
  draw(ctx);
  ctx.restore();
});