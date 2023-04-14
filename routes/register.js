var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var client = require('../config/mongo');
const axios = require('axios')
var config = require('../config/config');
const nodemailer = require('nodemailer')
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioClient = require('twilio')(accountSid, authToken);//middleware
router.use((req,res,next)=>{
  next();
//fs to read photo file length
 })

//

router.get('/login', function(req, res) {
  const user = req.user
  res.render('login',{user:user, message:""});
  }); 
  router.get('/register',async (req, res)=> {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    console.log(clientIp)
  
    try {
  const data={
          subpath:config.COLLECTION_SUBPATH,
          dbName:config.DB_NAME,
          collections:{
          [0]:"_blogs",
          [1]:"_services",
          [2]:"_intro_content",
          [3]:"_options"   
  }};
        const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
    console.log(req.cookies.user)
     res.render('register',{title:"send us a message",data:response.data});
    } catch (error) {
      res.status(500).json({error});
    }
  });
router.post('/regUser', (req,res) => {
 

  async function main(){
   try { 
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
  }
  }
/////////////////
  main().catch(console.error);
////////////////
const user = req.user
    async function createUser(client,newUser){
      const emailCheck = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_users').findOne({email:req.body.email});
      if(emailCheck){
        console.log(emailCheck);
        console.log('This email is Taken');
        return res.render('/login',{user:user, options:options,message:"this email is taken, try again or contact us"})
            }else{
   const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_users").insertOne(newUser);   
   let hash =await bcrypt.hash(req.body.password, 10);
   var myquery = { "providerId":newUser.providerId};
   var newvalues = { $set: {"password":hash } };
   await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_users").updateOne(myquery,newvalues, function(err) {
    if (err) throw err; 
  })  
  
 
   console.log(' :new user\n id: '+result.insertedId);
   res.render('/login',{user:user,options:options,message:"New User Created, please log in"})}
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
          from:'W2 MArketing WebApp ~ from '+ req.body.fname ,
          to:'w2marketing.scott@gmail.com',        
          subject:'W2 Marketing Contact Form',
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