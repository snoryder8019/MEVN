const pplID =document.getElementById('pplBodyId');
function buttonSwap(){
    console.log(pplID.childNodes[1].childNodes[9].src)
    pplID.childNodes[1].childNodes[9].src="/images/nm_1.png";
    pplID.childNodes[1].childNodes[9].style="border:none;background-color:rgba(0,0,0,0);max-width:100px;max-height:75px";
}