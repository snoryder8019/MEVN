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
    4:'_transactions',
    5:'_transCat'
  };
//
  router.get('/transactions',isAddy,getHandler(invCollections,'transactions'));




/////////////CSV UPLOAD
router.post('/csvUpload', upload.single('csv'),async (req, res) => {
    try {
        const filePath = req.file.path;
        const data = await csvtojson().fromFile(filePath);    
        const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertMany(data);
       // res.sendStatus(200);
      console.log(result)
       res.redirect('transactions');
      } catch (err) {
        console.log(err);
      }
    });
router.post('/addTransCat',(req,res)=>{
  async function transAdd(){
    const id = ObjectId(req.body._id)
    try{transPlant(client,id,{
    transType: req.body.transType
    })}
    catch (error){console.log(error)}
    }
  
  transAdd().catch(console.error);
  async function transPlant(client,options){
    const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transCat`).insertOne(options)
 console.log(result)
 res.redirect('transactions')
}}
  )
router.post('/updateTransCat/:id',(req,res)=>{
  async function transAdd(){
    const url = req.url.split('/')[2]
  const id = ObjectId(url)
    const options = req.body
    try{transPlant(client,id,options)}
    catch (error){console.log(error)}
    }
    
    transAdd().catch(console.error);
    async function transPlant(client,id,body){
      const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).updateOne({"_id":id},{$set:body},{upsert:false})
      console.log(result)
  res.redirect('../transactions')
  }}
  )
router.post('/delTrans',(req,res)=>{
  async function transAdd(){
  const transId = req.body.transId
  const id = ObjectId(transId)   
    try{transPlant(client,id)}
    catch (error){console.log(error)}
    }
    
    transAdd().catch(console.error);
    async function transPlant(client,id){
      const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).deleteOne({"_id":id})
      console.log(result)
  res.redirect('../transactions')
  }}
  )

//////////
router.post('/manualTransaction',(req,res)=>{
  async function createTrans(){
    const options = req.body
    console.log(options)
    try{addTrans(client,options)}
    catch(error){console.log(error)}
  }
  createTrans().catch(console.error);
  async function addTrans(client,options){
    const response = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertOne(options)
  console.log(response)
  res.redirect('transactions')
  }
})


  module.exports =router