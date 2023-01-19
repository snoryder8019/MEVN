const localSignin = document.getElementById('localSignin')
const localRegister = document.getElementById('localRegister')
const oauthBody = document.getElementById('oauthBody')
const gglMsg = document.getElementById('gglMsg')
const regGroup = [localRegister,oauthBody]
const loginGroup = [localSignin,oauthBody]
const allGroup = [localSignin,oauthBody,localRegister]

function loginSwap(zzx,zzz){
for (let i=0;i<allGroup.length;i++){
    allGroup[i].style.display="none"    
}
for (let x=0;x<zzx.length;x++){
    zzx[x].style.display="flex"
    gglMsg.innerHTML=""
    gglMsg.innerHTML=zzz
}
}

function checkPasswords() {
    // Get the values of the password inputs
    var password1 = document.getElementById('password1').value;
    var password2 = document.getElementById('password2').value;
  
    // Check if the passwords match
    if (password1 !== password2) {
      // If the passwords do not match, display an error message
      alert('The passwords do not match.');
    }
  }