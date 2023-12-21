var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var client = require('../config/mongo');
const axios = require('axios')
var config = require('../config/config');
const nodemailer = require('nodemailer')
const nodeSchedule = require('node-schedule');
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
router.get('/likeness', function(req, res) {
  const user = req.user
  res.render('likeness',{user:user, message:""});
  }); 
  router.get('/register',async (req, res)=> {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    console.log(clientIp)
  const user = req.user;
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
     res.render('register',{title:"send us a message",data:response.data, user:user});
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


// In-memory storage for IP tracking (consider using a database for production)
let ipSubmissionTimes = {};

// Schedule Messaging Service
nodeSchedule.scheduleJob('0 */2 * * *', () => {
  // Your messaging service code here
  console.log('Running scheduled messaging service');
  // ... (twilioClient messaging code)
});

router.post('/contactform', (req, res) => {
  const ip = req.ip; // Get IP address of the requester
  const currentTime = new Date();

  // Check if the IP has submitted in the last 2 hours
  if (ipSubmissionTimes[ip] && (currentTime - ipSubmissionTimes[ip]) < 2 * 60 * 60 * 1000) {
    // IP has submitted within the last 2 hours, suspend processing
    console.log(`IP ${ip} is temporarily suspended from submitting`);
    return res.status(429).send('Too many requests. Please try again later.');
  }

  // Update the submission time for this IP
  ipSubmissionTimes[ip] = currentTime;

  // Your existing email sending code
  let transporter = nodemailer.createTransport({ /* ... */ });
  let mailOptions = { /* ... */ };
  transporter.sendMail(mailOptions, function(error, info) {
    // ...
  });

  return res.redirect('/');
});



  module.exports = router;