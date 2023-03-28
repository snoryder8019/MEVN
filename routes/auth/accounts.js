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
  /////////////////~~~~~~~~~~~~~~~~~~~////////////////  
  /////////////////////ACCOUNTS.JS//////////////////
  //////////////~~~~~~~~~~~~~~~~~~~~~~~////////////////


  
  
////////////////////////// MAIN .find() DYNAMIC FUNCTION /////////////////////////
/////////////////////////////////////////////////////////
///////GET FROM HTTPS://MONGO.W2MARKETING.BIZ////////////////
function getHandler(collections,route) {
  return async (req, res) => {
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.ip;
      console.log(clientIp);  
      const data = {
        subpath: config.COLLECTION_SUBPATH,
        dbName: config.DB_NAME,
        collections,
      };  
      const response = await axios.get(config.DB_URL + '/api/readManyD', { params: data });
      console.log(response.data);
      res.render(route, { data: response.data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}  




//////////////////////////////
/////////////HANDLER ARGUMENTS/////////////////
//////////////////////////////

/////////////SERVICES.EJS/////////////////
const svcCollections = {
  0: '_services',
};
const servicesHandler = getHandler(svcCollections,'services');
router.get('/services', servicesHandler);

////////////ACCOUNTS.EJS//////////////////
  const clientsCollections = {
    0: '_clients',
  };  
  const clientsHandler = getHandler(clientsCollections,'accounts');
  router.get('/accounts', clientsHandler);
  
  
  
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
  //////////// MAIN insertOne.() DYNAMIC FUNCTION ///////////////
  ////////////POST TO HTTPS://MONGO.W2MARKETING.BIZ////////////////
  // Define a function that takes the `ext` and `options` parameters and returns a request handler function
  function postToHandler(ext, options, route) {
    return async (req, res) => {
      const postData = {dbName: config.DB_NAME,subpath: config.COLLECTION_SUBPATH,ext, options};
      try {
        const response = await axios.post(config.DB_URL + '/publish/postToDb', postData);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      res.redirect(route);
    };
  }

// Define the request handler using the `postToClientsHandler` function
const postToClients = (req, res) => {
  const { collectionExtName, contactName, email, companyName, phoneNumber, businessAddress } = req.body;
  const options = {contactName,email,companyName,phoneNumber,businessAddress,
    status: {active: true,delinquent: false,invoice_list: "",balance: ""}};

  const handler = postToHandler(collectionExtName, options, 'accounts');
  handler(req, res);
};
const postToServices = (req, res) => {
  const { collectionExtName, serviceName, cost,terms,serviceCategory, serviceDetail } = req.body;
  const options = {serviceName,cost,terms,serviceCategory,serviceDetail};

  const handler = postToHandler(collectionExtName, options, 'services');
  handler(req, res);
};

// Map the `/postToClients` route to the `postToClients` request handler function
router.post('/postToClients', postToClients);
router.post('/postToServices', postToServices);


  /////////////////////////////////  
  ///////////////ACCOUNTS.JS//////////////////
  //////////////////////////////


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
  /////////////////////////////////  
  ///////////////ACCOUNTS.JS//////////////////
  //////////////////////////////
module.exports = router