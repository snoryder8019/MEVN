const express = require('express');
const router = express.Router();
const axios = require('axios')
const config = require('../../config/config')

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




/////////////HANDLER ARGUMENTS/////////////////
///~~~~~~~~~~~SERVICES.EJS~~~~~~~~~~~~~~///
const svcCollections = {
  [0]:"_blogs",
  [1]:"_services",
  [2]:"_intro_content",
  [3]:"_options"  
};

const servicesHandler = getHandler(svcCollections,'services');
router.get('/services',isAddy, servicesHandler);
//~~~~~~~~~~~ACCOUNTS.EJS~~~~~~~~~~~////
  const clientsCollections = {
    0: '_clients',
    1:'_options'
  };  
 
  const clientsHandler = getHandler(clientsCollections,'accounts');
  router.get('/accounts',isAddy, clientsHandler);
   
  
  ////////////// MAIN .findOne() DYNAMIC FUNCTION /////////////////////////
  /////////////////////////////////////////////////////////
  ///////GET FROM HTTPS://MONGO.W2MARKETING.BIZ////////////////
  function getEditor(route) {
    return async (req, res) => {
    try {
      const clientIp = req.headers['x-forwarded-for'] || req.ip;
      console.log(clientIp);  
      const currentUrl = req.url
      const ext0 = req.url.split('&')[1]
      const ext = ext0.split('=')[1]
      const cleanUrl0 = currentUrl.split('=') [1]
      const cleanUrl = cleanUrl0.split('&')[0] 
      console.log(cleanUrl +"\n"+ ext);  
        const data = {
        subpath: config.COLLECTION_SUBPATH,
        dbName: config.DB_NAME,
        ext:ext,
        filter:cleanUrl
      }
      const data1 = {
        subpath: config.COLLECTION_SUBPATH,
        dbName: config.DB_NAME,
        collections:'_options'
       
      }
      const response = await axios.get(config.DB_URL + '/api/readOneF', { params: data });
      const options = await axios.get(config.DB_URL + '/api/readManyD', { params: data1 });
      console.log(options);
      res.render(route, { data: response.data,ext:ext, options:options });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}  
/////////////HANDLER ARGUMENTS/////////////////
//~~~~~~~~~EDITOR.EJS~~~~~~~~~~~//
const editorHandler = getEditor('editor');
router.get('/editor/:?',isAddy, editorHandler);









  //////////// MAIN insertOne.() DYNAMIC FUNCTION ///////////////
  ////////////POST TO HTTPS://MONGO.W2MARKETING.BIZ////////////////
  // Define a function that takes the `ext` and `options` parameters and returns a request handler function
  // function postToHandler(ext, options, route) {
  //   return async (req, res) => {
  //     const postData = {dbName: config.DB_NAME,subpath: config.COLLECTION_SUBPATH,ext, options};
  //     try {
  //       const response = await axios.post(config.DB_URL + '/publish/postToDb', postData);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //     res.redirect(route);
  //   };
  // }


///~~~~~~~~~~~~~SERVICES.EJS~~~~~~~~~~~~~~~~~~////
const postToClients = (req, res) => {
  const { collectionExtName, contactName, email, companyName, phoneNumber, businessAddress } = req.body;
  const options = {contactName,email,companyName,phoneNumber,businessAddress,
    status: {active: true,delinquent: false,invoice_list: "",balance: ""}};    
    const handler = postToHandler(collectionExtName, options, 'accounts');
    handler(req, res);
  };
  router.post('/postToClients',isAddy, postToClients);

  //~~~~~~~~~~~~~~~~~SERVICES.EJS~~~~~~~~~~/////
const postToServices = (req, res) => {
  const { collectionExtName, serviceName, cost,terms,serviceCategory, serviceDetail } = req.body;
  const options = {serviceName,cost,terms,serviceCategory,serviceDetail};
  const handler = postToHandler(collectionExtName, options, 'services');
  handler(req, res);
};
router.post('/postToServices0',isAddy, postToServices);


////////////////////////////////////////////
////////////////////////////////////////
router.post('/edit/:_id',isAddy,(req, res)=> {  
 const referer =req.headers.referer.split('=')[2]
 const referer1 =req.headers.referer.split('/')[3]
 const referer2 =req.headers.referer.split('/')[4]
 
   console.log(`/${referer1}/${referer2}`)
   const postData = {
     dbName:config.DB_NAME,
     subpath:config.COLLECTION_SUBPATH,
     ext:referer,
     options:req.body
    };
    const postRequest = async () => {
      try {
    const response = await axios.post(config.DB_URL+'/publish/insertOneF', postData);
   console.log(response.data)
   // console.log(req.body);
  } catch (error) {
    console.error(error);
  }
//res.send(response.data)
  //res.render(`editor`,{data:req.body})
  res.redirect(`/${referer1}/${referer2}`)
};
postRequest();
})



router.post('/delete/:_id',isAddy,(req, res)=> {
  
 // console.log(`MEVN~ req.body.data: ${req.body.data}`)
   const id = req.url.split('/')[2];
   console.log("id: "+id)
   const referer =req.headers.referer.split('=')[2]
   console.log("referer: "+referer)
   const postData = {
     dbName:config.DB_NAME,
     subpath:config.COLLECTION_SUBPATH,
     ext:referer ,
     options:id
    };
    const postRequest = async () => {
      try {
    const response = await axios.post(config.DB_URL+'/publish/deleteOneF', postData);
    console.log(`MEVN~ Response Data: ${response.data}`);
   // console.log(`MEVN~ req.body: ${req.body}`);
  } catch (error) {
    console.error(error);
  }

  res.redirect('../services')
};
postRequest();
})
/////////////////////////////////  
///////////////ACCOUNTS.JS//////////////////
  //////////////////////////////
module.exports = router