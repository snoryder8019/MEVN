
function getCart(){
    const cartDiv= document.getElementById('cartDiv')
    console.log('getcart')
    if(cartDiv.style.display="none")cartDiv.style.display="block";
}

function shrinkCart(){
    const cartDiv= document.getElementById('cartDiv')
    console.log('shrinkcart')
   if(cartDiv.style.display="none")cartDiv.style.display="none";
}
function getPaypal(){
    const payPalDiv = document.getElementById('paypal-button-container')
    const checkoutButton = document.getElementById('checkoutButton')
    const checkoutShrink = document.getElementById('checkoutShrink')
    console.log('getPaypal')
    if(payPalDiv.style.display="none"){
        payPalDiv.style.display="block"  
        checkoutButton.style.display="none"
        checkoutShrink.style.display="block"      
    }    
}
function shrinkPaypal(){
    const checkoutButton = document.getElementById('checkoutButton')
    const payPalDiv = document.getElementById('paypal-button-container')
    const checkoutShrink = document.getElementById('checkoutShrink')
    console.log('shrinkPaypal')
    if(payPalDiv.style.display="none"){
        payPalDiv.style.display="none"        
        checkoutShrink.style.display="none"      
        checkoutButton.style.display="block"
     }    
}