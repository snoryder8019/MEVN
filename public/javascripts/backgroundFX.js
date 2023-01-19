/** @type {HTMLCanvasElement}*/

const bFX = document.getElementById('backgroundFX');
const canvas = document.getElementById('bkgdCanvas');
const ctx = canvas.getContext('2d');
const mapR =255, mapB =255, mapG = 255;
const pxSize = 6;
//event listeners for window size and mouse location
 function drawRect(){
 
    let winH =window.innerHeight;
    let winW =window.innerWidth;
    let mouseX = window.event.clientX;
    let mouseY = window.event.clientY;
    let rectY = 0;
    let rectX = 0;
    let gridX = winW/pxSize;
    let gridY = winH/pxSize;
    let lCount =0;
    window.addEventListener("resize",function(){
     winH =window.innerHeight;
     winW =window.innerWidth;
           });
    window.addEventListener("mousemove",function(){
         mouseX = window.event.clientX;
         mouseY = window.event.clientY;
        let fromTopY= Math.round(100*(winH-mouseY)/winH)/100;
        let fromLeftX=Math.round(100*(winW-mouseX)/winW)/100;
        let red = mapR*fromTopY;
  let blue =mapB*fromTopY-(fromLeftX*3);
  let green=mapG*fromLeftX;
ctx.fillStyle='rgba('+red+','+blue+','+green+'0,1)';
//placement logic
//grid X&Y map the grid size to the window size
    if(rectX<gridX || rectY<gridY){
    rectX+=pxSize;
    rectY+=pxSize;
    
    };
    if(rectX>=gridX || rectY>=gridY){
       green=0;
       blue=0
      rectX=0;
      rectY=pxSize;
        lCount+=1;
        rectX=pxSize*lCount;
        rectY=-pxSize*lCount
    };
    if (lCount>200){
       red*=2;
       blue=0
        rectX=-200

    }
//rectX+=5
ctx.fillRect(rectX,rectY,pxSize,pxSize);
console.log("\nrectY: "+rectY +" rectX: "+ rectX)
console.log("\ngridY: "+gridY +" gridX: "+ gridX)
console.log("\nwinH: "+winH +" winW: "+ winW)
console.log("\nlCount: "+lCount)

   }) }