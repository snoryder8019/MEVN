function enlarge(){
    console.log('enlarge')
   let imgPrev =  document.getElementById('imgPrev')
   if(imgPrev.style.opacity==1){
    imgPrev.style.opacity=0
    imgPrev.style.zIndex=-5
    
}else{
    imgPrev.style.opacity=1
    imgPrev.style.zIndex=5
   }
   
}