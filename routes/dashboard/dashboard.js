const express = require('express');
const router = express.Router();
const env = require('dotenv').config()
const client = require('../../config/mongo');
const axios = require('axios')
const fs = require('fs');
const multer = require('multer');
const csvtojson = require('csvtojson');
const upload =multer({dest:"uploads/"});
const ObjectId = require('mongodb').ObjectId;
const config = require('../../config/config')

const getHandler  = require('../crud/getHandler');
const deleteHandler = require('../crud/deleteHandler');
const nodemailer = require('nodemailer')


router.get('/',(req,res)=>{
    
})

function isAddy(req,res,next){
  if(!config.ENV){
    res.send('environment not set')
  }
if(config.ENV=='DEV'){
  next()
}
if(config.ENV=='PROD'){
  if(!req.user){res.redirect('login')}
if(req.user.isAdmin==true){
  next()
}
  }}
  /////////////////~~~~~~~~~~~~~~~~~~~////////////////  
  /////////////////////INVOICE.JS//////////////////
  //////////////~~~~~~~~~~~~~~~~~~~~~~~////////////////
///~~~~~~~~~~~SERVICES.EJS~~~~~~~~~~~~~~///
const invCollections = {
    0: '_services',
    1: '_clients',
    2:'_invoice',
    3:'_options'
  };
//
  router.get('/dashboard',isAddy,getHandler(invCollections,'dashboard'));

  router.post('/markPaid',isAddy, (req,res)=>{
  async function markPaid(){
    const payStatus = {
        paymentDate:Date.now(),
        status:{
            draft:false,
            paid:true,
            delinquent:false
        }
    }
    try{await postPayment(client,{
        id:ObjectId(req.body._id),
       payStatus

    })}
    catch(err){console.log(err)}
  }
  markPaid().catch(console.error);
  async function postPayment(client,payParams){
    const pay = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:payParams.payStatus},{$upsert:false})
  console.log(pay)
  res.redirect('dashboard')
}
  })

  
  router.post('/unPaid',isAddy, (req,res)=>{
    async function markPaid(){
      const payStatus = {
          paymentDate:Date.now(),
          status:{
              draft:false,
              paid:false,
              delinquent:false
          }
      }
      try{await postPayment(client,{
          id:ObjectId(req.body._id),
         payStatus
  
      })}
      catch(err){console.log(err)}
    }
    markPaid().catch(console.error);
    async function postPayment(client,payParams){
      const pay = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:payParams.payStatus},{$upsert:false})
    console.log(pay)
    res.redirect('dashboard')
  }
    })









module.exports = router