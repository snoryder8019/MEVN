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
    3:'_options',
    4:'_transactions'
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




    router.post('/reDraft',isAddy, (req,res)=>{
      ////////
     
      ////////
      async function markDraft(){
        const cliId=req.body._id_client.split('|')[0]
        const invId = req.body.inv_id
        const draftStatus = {              
          status:{
            draft:true,
            paid:false,
            delinquent:false
          }
        }
        try{await reDraft(client,{
          id:ObjectId(req.body._id),
           draftStatus,
           invId:ObjectId(invId),
           cliId:ObjectId(cliId),
    
        })}
        catch(err){console.log(err)}
      }
      markDraft().catch(console.error);
      async function reDraft(client,params){

       const cliResult = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_clients`).findOne({"_id":params.cliId})
       const invResult = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).findOne({"_id":params.invId})
       const currentBal = invResult.invTotal
       console.log(cliResult.status.balance)//this works
       console.log(currentBal)//this works
       const newBalance0 = cliResult.status.balance-currentBal
       const newBalance = {status:{active:true,balance:newBalance0}}
       console.log(newBalance)//this works
       console.log(params.cliId)//this works
       const finalCli = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_clients`).updateOne({"_id":params.cliId},{$set:newBalance},{upsert:false})
       const finalInv = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":params.invId},{$set:params.draftStatus},{upsert:false})
       console.log(finalCli)//this works
       console.log(finalInv)//this works
       // const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:params.status},{$upsert:false})
        res.redirect('dashboard')
    }
      })
  ////////////////W2 ADMIN DASHBOARD ABOVE!!!!!


module.exports = router