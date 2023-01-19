function eventArg(){
    const t = window.event.target;
    const el =this.document.getElementById(t.id);
    el.style.display="none";
    const elSibling = this.document.getElementById(el.nextElementSibling.childNodes[0].id);
    elSibling.style.display="block"
}
function adminLoader(x){
 window.addEventListener(x, function(){
 eventArg();
    })
}
adminLoader("click");
//adminLoader("animationend");
//window.addEventListener("touchstart")

function expander(zzy){
    console.log(this.id)
}