/* eslint-disable no-inner-declarations */
var express = require('express');
var router = express.Router();
const axios = require('axios')
const request = require('request')


 /////////////
/* GET home page. */
router.get('/',async (req, res)=> {
  const clientIp = req.headers['x-forwarded-for'] || req.ip;
  console.log(clientIp)

  try {
const data={
        subpath:config.COLLECTION_SUBPATH,
        dbName:config.DB_NAME,
        collections:{
        [0]:"_blogs",
        [1]:"_services",
        [2]:"_intro_content",
        [3]:"_options"   
}};
      const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
  console.log(req.cookies.user)
   res.render('index',{data:response.data});
  } catch (error) {
    res.status(500).json({error});
  }
});
router.get('/thank-you',(req,res)=>{
  res.render('thank-you')
  })
router.get('/faqs',(req,res)=>{
    const options = {
      url:config.DB_URL+"/api/read",
      method:'GET',
      json:{
        subpath:config.COLLECTION_SUBPATH,
        dbName:config.DB_NAME,
        findParam:"_faqs"
      }      
     }
      request(options, (error,response, body)=>{
        if (error){
          console.log(error)
        }else{
          let faqs=body
          res.render('faqs',{faqs:faqs})      
       }
   })  
})
router.get('/about',(req,res)=>{
  
  res.render('about')
})
router.get('/service-agreements',(req,res)=>{
  return res.render('service-agreements')
 })   
////see more of the latest headline
module.exports = router;
