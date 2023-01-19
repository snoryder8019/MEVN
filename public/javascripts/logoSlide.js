

function logoSlide(){
   document.addEventListener('scroll', function(){
console.log(document.body.offsetHeight)


    const winPos =window.scrollY
        if(winPos<180){
        menu.style.backgroundImage=""
        footer.style.backgroundImage=""        
    }else{
        menu.style.backgroundImage="url('../images/logoW2.png')"
        footer.style.backgroundImage="url('../images/logoW2.png')"
    }
    })
}