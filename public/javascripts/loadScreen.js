const loadScreen = document.getElementById('loadScreen')
const loadMessage = document.getElementById('loadMessage')
function loading(zzy){
    console.log('loading')
    if(loadScreen.style.display="none"){

        loadScreen.style.display="block"
        loadMessage.innerHTML="'"+zzy+"'"
    }else{
        loadScreen.style.display="none"
    }
}