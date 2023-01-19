/** @type {HTMLCanvasElement}*/

//const bFX = document.getElementById('backgroundFX');
const canvas = document.getElementById('bkgdCanvas');
const ctx = canvas.getContext('2d');

canvas.width= window.innerWidth;
canvas.height= window.innerHeight;


class Core {
  constructor (x,y){
    this.x=x;
    this.y=y;
    this.size=0;
    this.maxSize=3;
    
    }
  update(){
    this.x+=Math.random()*5-2 ;
    this.y+=Math.random()*5-2 ;
    this.size +=Math.random()*2-1;
    if (this.size<this.maxSize){
    ctx.beginPath();
    ctx.rect(this.x,this.y,this.size,this.size);
    ctx.strokeStyle='hsl(100,100%,100%)';
    ctx.fillStyle='hsl(160,70%,70%)';
    ctx.fill();
    ctx.stroke();
  requestAnimationFrame(this.update.bind(this));
    }
    if(this.size>this.maxSize){
      ctx.clearRect(this.x+=Math.random()*100,this.y+=Math.random()*5-7,this.size,this.size)
    }
  }
}
window.addEventListener('mousemove', function(e){
 // console.log('listenerAdded')
 for(let i=0;i<2;i++){
  const core = new Core(e.x,e.y);
  core.update();
 }
}

);
