const express = require('express');
const router = express.Router();
const env = require('dotenv').config()
const client = require('../config/mongo');
const axios = require('axios')
const fs = require('fs');
const multer = require('multer');
const csvtojson = require('csvtojson');
const upload =multer({dest:"uploads/"});
const ObjectId = require('mongodb').ObjectId;
const config = require('../config/config')

const getHandler  = require('./crud/getHandler');
const deleteHandler = require('./crud/deleteHandler');
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
// const invCollections = {
//     0: '_services',
//     1: '_clients',
//     2:'_invoice',
//     3:'_options',
//     4:'_transactions'
//   };
// //
//   router.get('/clientDashboard/:id',getHandler(invCollections,'clientDashboard'));

router.get('/clientDashboard/:id', async (req, res) => {
    const collArray = [
      '_services',
      '_clients',
      '_invoice',
      '_options',
      '_transactions'
    ];
  
    async function cliDash() {
     const id =ObjectId(req.url.split('/')[2])
     const dataArray = [];
     const dashInfo=[];
     console.log(dashInfo)
  
      try {
        await cliData(client, collArray, dataArray);
        await dashData(client, collArray, dashInfo,id);
        console.log(dataArray);
        res.render('clientDashboard', { data: dataArray, dash:dashInfo });
      } catch (error) {
        console.log(error);
      }
    }
  
    await cliDash().catch(console.error);
  });
  async function dashData(client,collArray,dashInfo,id){
      const dash = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}${collArray[1]}`).findOne({"_id":id});
      dashInfo.push(dash)
      console.log(`dash: ${Object.keys(dashInfo[0])}`)
  }
  async function cliData(client, collArray, dataArray) {
   // console.log('cliData');
  
    for (let i = 0; i < collArray.length; i++) {
      dataArray.push([]); // initialize with empty sub-array
      const data = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}${collArray[i]}`).find().toArray();
      dataArray[i].push(data);
    }
    console.log(dataArray[2][0]);
  }






module.exports = router