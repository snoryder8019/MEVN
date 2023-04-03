var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var client = require('../config/mongo');
const axios = require('axios')
const nodemailer = require('nodemailer')
const config = require('../config/config')
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = require('twilio')(accountSid, authToken);//middleware
router.use((req,res,next)=>{
  next();
//fs to read photo file length
 })
router.get('/', (req,res,next) =>{
  next();
})
//

router.get('/login', function(req, res) {
  const user = req.user
  res.render('login',{user:user});
  }); 
router.get('/',async function(req, res) {
  const user = req.user
  try{
  const data={
    subpath:config.COLLECTION_SUBPATH,
    dbName:config.DB_NAME,
    collections:{
    [0]:"_blogs",
    [1]:"_inventory",
    [2]:"_intro_content",
    [3]:"_users"    
}};
  const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
//console.log(response.data)
  res.render('register', { title: 'Contact Us', user:user ,data:response.data});
}
catch(error){console.log(error)}
});

router.post('/regUser', (req,res) => {
 

  async function main(){
   try { 
   // await client.connect();
    await createUser(client,{    
      provider:'local', 
      providerId:'local'+Date.now(),
      name: req.body.name,
      email: req.body.email,    
      password: "",
      isAdmin: false,
      cart:[],
      createdAt: Date.now
    });
  }catch (err){
    console.log(err)
  }finally{
    //await client.close();
  }
  }
/////////////////
  main().catch(console.error);
////////////////
    async function createUser(client,newUser){
      const emailCheck = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_users').findOne({email:req.body.email});
      if(emailCheck){
        console.log(emailCheck);
        console.log('This email is Taken');
        return res.redirect('/login')
            }else{
   const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_users").insertOne(newUser);   
   let hash =await bcrypt.hash(req.body.password, 10);
   var myquery = { "providerId":newUser.providerId};
   var newvalues = { $set: {"password":hash } };
   await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_users").updateOne(myquery,newvalues, function(err) {
    if (err) throw err; 
  })  
  
 
   console.log(' :new user\n id: '+result.insertedId);
   res.redirect('/login')}
   }
 
})

router.post('/contactform', (req,res) => {
  // const messagingServiceSid = 'MG3fbb6ed2b097681e40887cfd1074546a'
  // const numbers = ['+16822414402','+16822305399']
  // numbers.forEach(number => {
  //   twilioClient.messages
  //     .create({
  //       body: 'from coach scott: test from w2',
  //       messagingServiceSid: messagingServiceSid,
  //      // from: '+18886174452',
  //       to:number
  //     })
  //     .then(message => console.log(`SMS sent to ${message.to}`))
  //     .catch(error => console.error(`Error sending SMS to ${number}:`, error));
  // });




    console.log("posts initiated")
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port:587,
      auth:{
          user: process.env.EMAILNAME,
          pass:process.env.EMAILPASS,   
        }
  })
      let mailOptions = {
          from:`${config.COMAPNY_NAME} WebApp ~ from `+ req.body.fname ,
          to:config.EMAIL,        
          subject:`${config.COMAPNY_NAME} Contact Form`,
          text: req.body.message,
          html:'<head><style>body{background-color:black;color:white}</style></head><body><h1><span>You Received a message from a guest on your website about <h2>'+req.body.regType+'</h2></span> </h1><br><h1>'+req.body.fname+' says: </h1><br><h2>'+req.body.message+'</h2><br>'+req.body.email+'</body>'
      };
      transporter.sendMail(mailOptions,function(error,info){
          if(error){
              console.log("transporter "+error);  
          }
          else{
          console.log('email sent'+ info.response)


          }        
      })

  

   return res.redirect('/');
     })


  module.exports = router;