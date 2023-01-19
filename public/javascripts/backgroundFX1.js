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
    this.speedX = Math.random()*-2;
    this.speedY = Math.random()*9-2;
    this.maxSize = Math.random() * 7 +1;
    this.size = Math.random() * .25+.5;
    this.va = Math.random()* .22 + 0.05
    this.angle =Math.random()*6.2;
    this.alpha=1;
  }
  update(alphaNo){
    this.x +=this.speedX + Math.sin(this.angle);
    this.y +=this.speedY /*+ Math.sin(this.angle)*/;
    this.size +=this.va;
    this.angle +=this.va;
    //console.log('checking if statement')
    if(this.size < this.maxSize){
      //console.log('if logic')
      //ctx.globalAlpha=.5;
      ctx.beginPath();
      // ctx.arc(this.x,this.y,this.size, Math.cos(1+3), Math.PI *2.5);
      ctx.moveTo(this.x,this.y)
      ctx.lineTo(this.x+Math.random()*3,this.y+Math.random()*2)
      ctx.lineTo(this.x+Math.random()*-3,this.y-Math.random()-3)
     ctx.lineTo(this.x+Math.random()*1,this.y-Math.random()*3)
     ctx.lineTo(this.x+Math.random()*-2,this.y-Math.random()*3)
     ctx.lineTo(this.x+Math.random()*-4,this.y-Math.random()*-4)
     let matchClr=Math.random()*200     // ctx.fillStyle = 'hsl('+Math.random()*40+','+matchClr+'%,'+matchClr*2+'%)';
     ctx.globalAlpha=this.alpha-alphaNo;
     ctx.strokeStyle = 'hsl('+Math.random()*40+','+matchClr+'%,'+matchClr+'%)';
     // ctx.strokeStyle = 'none';
     // ctx.fill();
  
     ctx.stroke();
     // ctx.globalAlpha=1;
     
     requestAnimationFrame(this.update.bind(this));
    }
  }
}
window.addEventListener('mousemove', function(e){
  // console.log('listenerAdded')
  let alphaNo;
  for(let i=0;i<1;i++){
  
    const core = new Core(e.x,e.y);
    
    core.update();
    
    
  }
}

);
