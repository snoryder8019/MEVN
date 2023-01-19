

function slide(){
    console.log('slide added')
    const bkgrdImage = document.getElementById('bkgrdImage');
    const mainBody = document.getElementById('mainBody');
    const bkImg = bkgrdImage.getAttribute('src');
   document.addEventListener('scroll',function(){ 
    const winPos =document.body.scrollHeight-window.innerHeight-window.scrollY
    const winH = document.body.scrollHeight
    console.log(winPos/winH)
  if(winPos/winH=.33)
  bkgrdImage.src="/images/dPlate.png"
  bkgrdImage.setAttribute('class','okImg')
  
//   if(winPos/winH>.33 && winPos/winH<.66)
//   bkgrdImage.src="/images/pipeline.png"
//   bkgrdImage.setAttribute('class','okImg')
  
  if(winPos/winH=.66)
  bkgrdImage.src="/images/bkgrd_0.jpg"
  bkgrdImage.setAttribute('class','okImg')

   })
  



  }
  