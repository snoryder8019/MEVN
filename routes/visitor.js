const express = require('express');
const router = express.Router();
const client = require('../config/mongo');
const dbName= 'w2Apps';
router.use('/',(req,res, next)=>{
next();
})
router.get('/visitor', function(req, res, next) {
  res.render('visitor', { title: 'visitors' });
  });
router.post('/visitor', (req,res)=>{
const clickID=req.body.buttonID;
console.log(clickID);
   async function gettingEmails(clickID){
    try {
     await client.connect();
     await getEmails(client);
    }
    catch(err){
      console.log(err)
    }
    finally{
    await client.close();
  }}
  //calling the function
  gettingEmails(clickID).catch(console.error);
  async function getEmails(client){
  const data = await client.db(dbName).collection('registry').findOne({email:clickID});

 res.render('./visitor',{title:"visitor Here", data:data})
   }

})

router.post('/delRegister',(req,res) =>{
  async function getUsertoDelete(){
 try{
    await client.connect();
  await findThem(client);
    }
  catch(err){
    console.log(err)
  }
  finally{
   await client.close()
 }}
getUsertoDelete().catch(console.error);
  async function findThem(client) {
    const data = await client.db(dbName).collection('registry').find().toArray();
    const blogs = await client.db(dbName).collection('blogs').find().toArray();   
     console.log();
    res.render('admin',{title:'removed!!\n'+req.body.delConfirm, data:data, blogs:blogs})
  }
})
//////////////////
router.post('/adminHit',(req,res)=>{
  res.redirect('../admin')
})

  module.exports=router;