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

const invCollections = {
    0: '_services',
    2:'_invoice',
    3:'_options',

  };
//
  router.get('/wix',getHandler(invCollections,'wix-services'));


  router.post('/visible',(req,res)=>{
    const idPre = req.body._id
    const id = ObjectId(idPre)
    const update = req.body.status
    async function visibility(){
  try{await visUpdate(client,id,{
    status:update
  })}
  catch(error){console.log(error)}
    }
    visibility().catch(console.error)
  async function visUpdate(client,id,updateInfo){
   const response = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_services").updateOne({"_id":id},{$set:updateInfo},{upsert:false})
console.log(response)
res.redirect('services')
  }
  })

module.exports=router