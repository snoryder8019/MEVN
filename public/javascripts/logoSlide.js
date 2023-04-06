

function logoSlide(){
    document.addEventListener('scroll', function(){
        console.log(document.body.offsetHeight)
        const logoDiv=document.getElementById('logoDiv')


    const winPos =window.scrollY
        if(winPos<180){
        logoDiv.style.backgroundImage=""
        footer.style.backgroundImage=""        
    }else{
        logoDiv.style.backgroundImage="url('../images/logoW2.png')"
        footer.style.backgroundImage="url('../images/logoW2.png')"
    }
    })
}