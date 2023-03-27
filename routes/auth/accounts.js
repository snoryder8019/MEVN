const express = require('express');
const router = express.Router();
const env = require('dotenv').config()
const client = require('../../config/mongo');
const axios = require('axios')
const fs = require('fs');
const multer = require('multer');
const upload =multer({dest:"uploads/"});
const ObjectId = require('mongodb').ObjectId;
const config = require('../../config/config')
//////////////////middleware
function isAddy(req,res,next){
  if(!req.user){res.redirect('login')}
if(req.user.isAdmin==true){
  next()}
    else{res.sendStatus(401)}
  }
/////////////////////////////////////
router.get('/services', async (req,res)=>{
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)
try{
  const data={
    subpath:config.COLLECTION_SUBPATH,
    dbName:config.DB_NAME,
    collections:{
      [0]:"_services"
    }};
    const response =await axios.get(config.DB_URL+'/api/readManyD',{params:data})
    console.log(response.data)
    res.render('services',{ data:response.data})

} catch (error) {
    res.status(500).json({ error: error.message});
}
})

router.get('/accounts',async (req,res)=>{
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)
try{
  const data={
    subpath:config.COLLECTION_SUBPATH,
    dbName:config.DB_NAME,
    collections:{
     [0]:"_clients"
    }};
    const response =await axios.get(config.DB_URL+'/api/readManyD',{params:data})
    console.log(response.data)
    res.render('accounts',{ data:response.data})

} catch (error) {
    res.status(500).json({ error: error.message});
}
  })


router.post('/postToClients',(req, res)=> {
  console.log(req.body)
const postData = {
dbName:config.DB_NAME,
subpath:config.COLLECTION_SUBPATH,
ext:req.body.collectionExtName ,
options:{
  contactName:req.body.contactName,
  email:req.body.email,
  companyName:req.body.companyName,
  phoneNumber:req.body.phoneNumber,
  businessAddress:req.body.businessAddress,
  status:{
    active:true,
    delinquent:false,
    invoice_list:"",
    balance:""
  }
},validate:true
  // Add any other data you want to send in the POST request
};
const postRequest = async () => {
  try {
    const response = await axios.post(config.DB_URL+'/publish/postToDb', postData);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
postRequest();
res.redirect('accounts')
 })
router.post('/postToServices',(req, res)=> {
  console.log(req.body)
const postData = {
dbName:config.DB_NAME,
subpath:config.COLLECTION_SUBPATH,
ext:req.body.collectionExtName ,
options:{
  serviceName:req.body.serviceName,
  cost:req.body.cost,
  terms:req.body.terms,
  serviceCategory:req.body.serviceCategory,
  serviceDetail:req.body.serviceDetail
},
validate:false
  // Add any other data you want to send in the POST request
};
const postRequest = async () => {
  try {
    const response = await axios.post(config.DB_URL+'/publish/postToDb', postData);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
postRequest();
res.redirect('services')
 })

 router.post('/removeService',(req, res)=> {
  console.log(req.body)
const postData = {
dbName:config.DB_NAME,
subpath:config.COLLECTION_SUBPATH,
ext:req.body.collectionExtName ,
options:{
id:req.body.serviceId
}
  // Add any other data you want to send in the POST request
};
const postRequest = async () => {
  try {
    const response = await axios.post(config.DB_URL+'/publish/deleteFromDb', postData);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
postRequest();
res.redirect('services')
 })








module.exports = router