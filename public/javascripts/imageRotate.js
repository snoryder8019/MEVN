const body = document.body
const landingImage = document.getElementsByClassName('landingPage')
const introImgDiv=landingImage[0].children
function imageListener(){
    
    for(let i=0;i<introImgDiv.length;i++){
        let divSelect = introImgDiv[i].children[2]
        let divSelect1 = introImgDiv[i].children[1]

        divSelect.addEventListener('mouseover',function(){
console.log('enterMe!!')

divSelect.style.transform="rotate3d(0,1,0,90deg)"
})
divSelect1.addEventListener('mouseleave',function(){
    console.log('leaveMe!!')
    divSelect.style.transform="rotate3d(0,1,0,0deg)"
        })
    console.log(introImgDiv[i].children[1])
    }
    }
