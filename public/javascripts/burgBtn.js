function menuOpen(){
    const bBtn = document.getElementById('burgBtn')
    const hTop = document.getElementById('hmTop')
    const hMid = document.getElementById('hmMid')
    const hBot = document.getElementById('hmBot')
    const menuPage = document.getElementById('menuPage')


    if(menuPage.style.opacity==1){
        menuPage.style.opacity=0;
        menuPage.style.zIndex=-3;
        hTop.style.transform="rotateZ(0deg) translateY(0) translateX(0)"
        hBot.style.transform="rotateZ(0deg) translateY(0) translateX(0)"
        hMid.style.opacity=1
        bBtn.style.minWidth='65px'
    }else{
        menuPage.style.opacity=1
        menuPage.style.zIndex=3;
        hTop.style.transform="rotateZ(45deg) translateY(200%) translateX(15%)"
        hBot.style.transform=" rotateZ(-45deg)  translateY(-200%) translateX(20%)"
        hMid.style.opacity=0
        bBtn.style.minWidth='50px'
    }
}
function menuOpen_sook(){
    const bBtn = document.getElementById('burgBtn')
    const hTop = document.getElementById('hmTop')
    const hMid = document.getElementById('hmMid')
    const hBot = document.getElementById('hmBot')
    const menuPage = document.getElementById('menuPage')


    if(menuPage.style.opacity==1){
        menuPage.style.opacity=0;
        menuPage.style.zIndex=-3;
        hTop.style.transform="rotateZ(0deg) translateY(0) translateX(0)"
        hBot.style.transform="rotateZ(0deg) translateY(0) translateX(0)"
        hMid.style.opacity=1
        bBtn.style.width='100%'
    }else{
        menuPage.style.opacity=1
        menuPage.style.zIndex=3;
        hTop.style.transform="rotateZ(45deg) translateY(300%) translateX(32%)"
        hBot.style.transform=" rotateZ(-45deg)  translateY(-300%) translateX(32%)"
        hMid.style.opacity=0
        bBtn.style.width='120%'
    }
}