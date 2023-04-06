const express = require('express');
const router = express.Router();
const axios = require('axios')
const config = require('../../config/config')
const copy = require('../../config/copy')
const getHandler  = require('../crud/getHandler');
const postToHandler  = require('../crud/postToHandler');


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
/////////////////////////////////  
///////////////ACCOUNTS.JS//////////////////
  //////////////////////////////
module.exports = router