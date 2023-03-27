/* eslint-disable no-inner-declarations */
const express = require('express');
const router = express.Router();
const client = require('../config/mongo');
const axios = require('axios')
const dbName= 'w2Apps';
const ObjectId = require('mongodb').ObjectId;
//////////////////middleware
router.use((req,res,next)=>{

next();
})
//////////////////////////////////
router.get('/market',async (req, res)=> {
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)
  try {
const data={
        subpath:config.COLLECTION_SUBPATH,
        dbName:config.DB_NAME,
        collections:{  
        [0]:"_users",
              [1]:"_inventory",
              [2]:"_categories"
             
}};
      const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
  console.log(response.data)
    res.render('market',{data:response.data});
  } catch (error) {
      res.status(500).json({ error: error.message});
  }
});
//////////////////////////////
router.get('/marketOp',async (req,res)=>{
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)
  try {
const data={
        subpath:config.COLLECTION_SUBPATH,
        dbName:config.DB_NAME,
        collections:{  
        [0]:"_users",
              [1]:"_inventory",
              [2]:"_categories",
             // findParam3:"_users"    
}};
      const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
  console.log(response.data)
    res.render('market',{data:response.data});
  } catch (error) {
      res.status(500).json({ error: error.message});
  }})
//////////////////////////////
router.get('/productID/:_id',async (req,res)=>{
 const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)
  try {
const data={
        subpath:config.COLLECTION_SUBPATH,
        dbName:config.DB_NAME,
        collections:{  
        [0]:"_users",
        [1]:"_inventory",
        [2]:"_categories"               
    }};
      const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
  console.log(response.data)
    res.render('productID',{data:response.data});
  } catch (error) {
      res.status(500).json({ error: error.message});
  }})
      

  ////////////////
      router.post('/addToCart',(req,res)=>{

        async function gettingCart(data){
  const user= req.user
  try {
    await client.connect();
    await getCart(client);
  }
  catch(err){
    console.log(err)
  }
  finally{
    await client.close();
  }}
  gettingCart().catch(console.error);
  
  async function getCart(client){
    const user = req.user
const session = req.session
    const prodId = ObjectId(req.body.prodId)
    if (session.user){
      console.log('session id')
      let newID =ObjectId(session.user._id);
      await client.db(dbName).collection('users').updateOne(
        {"_id":newID},{
          $push:{ cart:{
            nm_inventory :  prodId,
            price:req.body.prodPrice,
            name:req.body.prodName,
            img:req.body.prodImg}
          }
  });
    }
    if (user){
      console.log('user id')
    let newID =ObjectId(user._id);
    await client.db(dbName).collection('users').updateOne(
      {"_id":newID},{
        $push:{ cart:{
          nm_inventory :  prodId,
          price:req.body.prodPrice,
          name:req.body.prodName,
          img:req.body.prodImg}
        }
});
    }
    // const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
    

////////
return res.redirect(req.get('referrer'));
}}
)
//////DELETE CART ITEM **Stable 10-5-22
router.post('/delCart',(req,res)=>{
  const user = req.user
  const session = req.session
  async function deleteCart(){
    try{
      await client.connect();
      await getCart(client);  
    }
    catch(err){
      console.log("error"+err);
    }
    finally{
      await client.close();
    }
  }
  deleteCart().catch(console.error);
  async function getCart(client){
  
if(session.user){
    const cartFind = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.session.user._id)});
    const delItem = await client.db(dbName).collection('users').updateOne(
    {"_id":ObjectId(session.user._id)},
    {$pull:{"cart":{"name":req.body.cartNum}}});  
    }
if(user){
    const cartFind = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
    const delItem = await client.db(dbName).collection('users').updateOne(
    {"_id":ObjectId(req.user._id)},
    {$pull:{"cart":{"name":req.body.cartNum}}});  
    }
    console.log(req.body.cartNum[0].name)
    console.log(req.body.cartNum)
 
   return res.redirect(req.get('referrer'));
  }
})
//////////

module.exports = router;