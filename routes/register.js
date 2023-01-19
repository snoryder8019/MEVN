var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var client = require('../config/mongo');
const nodemailer = require('nodemailer')
const dbName= 'w2Apps';

//middleware
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
router.get('/register', function(req, res) {
  const user = req.user
  res.render('register', { title: 'Contact Us', user:user });
});

router.post('/regUser', (req,res) => {
  async function main(){
   try { 
    await client.connect();
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
      const emailCheck = await client.db(dbName).collection('users').findOne({email:req.body.email});
      if(emailCheck){
        console.log(emailCheck);
        console.log('This email is Taken');
        return res.redirect('/login')
            }else{
   const result = await client.db(dbName).collection("users").insertOne(newUser);   
   let hash =await bcrypt.hash(req.body.password, 10);
   var myquery = { "providerId":newUser.providerId};
   var newvalues = { $set: {"password":hash } };
   await client.db(dbName).collection("users").updateOne(myquery,newvalues, function(err) {
    if (err) throw err; 
  })  
  
 
   console.log(' :new user\n id: '+result.insertedId);
   res.redirect('/login')}
   }
 
})

router.post('/contactform', (req,res) => {
  async function main(){
  
   // connection async try catch 
  try {
   // await client.connect();
    //main function durin db call
  
    //call another function
    await createUser(client,{
      name: req.body.regName,
      email: req.body.regEmail,
      message : req.body.regType
    });
  }catch (err){
    console.log(err)
  }finally{
 //   await client.close();
  }
  }
  main().catch(console.error);
  
  async function createUser(client,newUser){
   const result = await client.db(dbName).collection("registry").insertOne(newUser);
   console.log('new user id: '+result.insertedId+'\n email: '+ req.body.email)
  }
    console.log("posts initiated")
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port:587,
      auth:{
         //type:'OAuth2',
          user: process.env.EMAILNAME,
          pass:process.env.EMAILPASS,
          // clientId: cId,
          // clientSecret:cSec,
          // refreshToken:rToke,
          // accessToken:accessToken
        }
  })
      let mailOptions = {
          from:'Nocometalworkz.com WebApp!! from '+ req.body.fname ,
          to:'w2marketing.scott@gmail.com, noco_metalworkz@outlook.com', 
        
       // to:'snoryder8019@gmail.com',
          subject:'NOCOMETALWORKZ.COM SUBMISSION',
          text: req.body.message,
          html:'<body style="background-color:black;color:white>"<h1><span>You Received a message from a guest on your website about <h2>'+req.body.regType+'</h2></span> </h1><br><h1>'+req.body.fname+' says: </h1><br><h2>'+req.body.message+'</h2><br>'+req.body.email+'</body>'
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