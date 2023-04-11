const express = require('express');
const router = express.Router();
const axios = require('axios')
const config = require('../../config/config')

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
  /////////////////~~~~~~~~~~~~~~~~~~~////////////////  
  /////////////////////ACCOUNTS.JS//////////////////
  //////////////~~~~~~~~~~~~~~~~~~~~~~~////////////////
router.get('/tickets',(req,res)=>{
res.render('tickets')
})

const postToTickets = (req, res) => {
  const { reportOwner, issue } = req.body;
  const options = {reportOwner,issue,
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
module.exports = router