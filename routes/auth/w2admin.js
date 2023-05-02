const express = require('express');
const router = express.Router();
const axios = require('axios')
const client = require('../../config/mongo');
const ObjectId = require('mongodb').ObjectId;
const getHandler  = require('../crud/getHandler');
const postToHandler  = require('../crud/postToHandler');
const postToExternal = require('../crud/postToExternal');


//////////////////middleware
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
function isDubs(req,res,next){
  if(!config.ENV){
    res.send('environment not set')
  }
if(config.ENV=='DEV'){
  next()
}
if(config.ENV=='PROD'){
  if(!req.user){res.redirect('login')}
if(req.user.isW2==true){
  next()
}
  }}
  /////////////////~~~~~~~~~~~~~~~~~~~////////////////  
  /////////////////////ACCOUNTS.JS//////////////////
  //////////////~~~~~~~~~~~~~~~~~~~~~~~////////////////
router.get('/tickets',(req,res)=>{
res.render('tickets')
})
//////////////////
router.get('/ticketsDashboard',(req,res)=>{
  async function getTickets(){
    try{ticketGrab(client)}
    catch(err){console.log(err)}
  }
  getTickets().catch(console.error())
  async function ticketGrab(client){
   const tickets= await client.db(config.DB_NAME).collection('tickets_submission').find().toArray()
   console.log(tickets)
   res.render('ticketsDashboard',{tickets:tickets})
  }
})
///////////////////
const postToTickets = (req, res) => {
  const { reportOwner, issue } = req.body;
  const options = {reportOwner,issue,
    reportersId:req.ip,
    source:req.headers.origin.split('//')[1],
    status: {open: true,resolved: false,date:Date.now(),source: config.comapnyName}};    
    const handler = postToExternal('tickets','_submission', options, 'accounts');
    handler(req, res);
  };
  router.post('/postTicket', postToTickets);




router.post('/postTicket',(req,res)=>{
  res.render('thank-you',{thankyou:"thank you for registering a ticket"})
})
/////////////////////////////////  
///////////////ACCOUNTS.JS//////////////////
  //////////////////////////////

  router.post('/checkoutHook',(req,res)=>{
    console.log(req.body)
    async function checkoutHook(){
      try{await getCheckout(client,{
        paypalData:req.body
      })}
      catch(error){console.log(error)}
    }
    checkoutHook().catch(console.error);
    async function getCheckout(client,options){
      const response = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_ppTransactions`).insertOne(options)
     console.log(`Webhook hit checkoutHook: ${response}`)
    }
  })
module.exports = router