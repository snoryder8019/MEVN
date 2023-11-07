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

const getHandler  = require('../crud/getHandler');
const deleteHandler = require('../crud/deleteHandler');
const nodemailer = require('nodemailer')
//////////////////middleware
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
    3:'_options'
  };
//
  router.get('/invoice',isAddy,getHandler(invCollections,'invoice'));
router.post('/renderInvoice',(req,res)=>{
  function invTotal() {
      let invData = req.body
      console.log(req.body.invData)
      let total = 0;     
     // const svcArray = []
  // console.log( invData.serviceName[0].split('|')[2])
   if (typeof invData.serviceName == 'string'){
    total += Number(invData.serviceName.split('|')[2])
   }
   if (typeof invData.serviceName == 'object'){
      for (let i = 0; i < invData.serviceName.length; i++) { 
      //  console.log(typeof invData.serviceName)       
        let cost0 = invData.serviceName[i].split('|')[2];
        let cost = Number(cost0)
        total += cost
      }
    }
     return total;
      }   
 async function postInvoice(){ 
  const options = {
    invData:req.body,
    invTotal:invTotal(),
    date:Date.now(),
    status:{
      paid:false,
      draft:true,     
      delinquent:false
     }
     }
   try{await invPoster(client,options)
    }   catch (error){console.log(error)}
   }
   postInvoice().catch(console.error)
   async function invPoster(client,postOptions){
    const response = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_invoice").insertOne(postOptions)

res.redirect('invoice')
}
})




/////////////***VIEWER */
router.get('/invoiceViewer/:_id',(req,res)=>{  

  async function invoiceViewer(){
    const url0= req.url.split('/')[2]
    const id= ObjectId(url0)
    console.log(id)
    try{
      await invInfo(client,id)}
      catch (error){
        console.log(error)}
      }      
      invoiceViewer().catch(console.error);      
      async function invInfo(client,postData){
        const invoice= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_invoice').findOne({"_id":postData})
        const options= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_options').find().toArray()
        console.log("invoice data: "+invoice.invData)
        const data =[]
        const svcDetails =[]
        const serviceIds = []
        const companyId = invoice.invData.companyId.split('|')[0]
        console.log("type: "+typeof invoice.invData.serviceName)
     
        
        if(typeof invoice.invData.serviceName === 'object'){
        for(let i=0;i<invoice.invData.serviceName.length;i++){
          const svcId = invoice.invData.serviceName[i].split('|')[0]
          serviceIds.push(svcId)
        }
        for(let i=0;i<serviceIds.length;i++){
          const id= ObjectId(serviceIds[i])  
          const service= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_services').findOne({"_id":id}) 
          console.log(service)
          svcDetails.push(service)
        }
        }
        if(typeof invoice.invData.serviceName === 'string'){
          
          const strid= ObjectId(invoice.invData.serviceName.split('|')[0])  
          console.log("id: "+strid)
          const service= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_services').findOne({"_id":strid}) 
          svcDetails.push(service)

    }
    const compId =ObjectId(companyId)
    const company= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_clients').findOne({"_id":compId})
    data.push(svcDetails,company,invoice)
    console.log(data) 
   // res.send(data)
    res.render('invoiceViewer', {data:data, options:options})
  }
 }
)
/////////////////////////////////////
router.post('/invDelete',(req,res)=>{
  async function deleteinv(){
  const url = req.body.invId
  console.log(url)
  const id = ObjectId(url)
  try{await delFunc(client,id)}
  catch (error){console.log(error)}
}
deleteinv().catch(console.error)
async function delFunc(client,searchId){
  const response = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_invoice').deleteOne({"_id":searchId})
res.redirect('invoice')
}
})


router.post('/invSend/:_id',(req,res)=>{
  console.log(req.url)
///////////////////////////
async function main(){  
  try { 
    const today = new Date()
    const dueDate = new Date(today.getTime()+(15*24*60*60*1000))    
    await createUser(client,
     {published:new Date(),
      partialPayments:0 ,
      due:dueDate,
      status:{
      draft:false,    
      paid:false,
      delinquent:false,       
    }
     
    },
      ObjectId(req.body.invId));
}catch (err){
  console.log(err)
}}
main().catch(console.error);  
async function createUser(client,options,id){
 const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_invoice").updateOne({"_id":id},{$set:options},{upsert:true});
 let result0 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_invoice").findOne({"_id":id});
 const compId=ObjectId(result0.invData.companyId.split('|')[0])
 let result1 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_clients").findOne({"_id":compId});
const invTotal = parseFloat(result0.invTotal)

 let newBalance= parseFloat(result1.status.balance)
 console.log(invTotal)
 const totalBalance =newBalance + invTotal;
 console.log(newBalance)
 
 const update = {
  status:{
    active:true,
    balance:totalBalance,
  }
 }
 const updateClient = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_clients`).updateOne({"_id":compId},{$set:update},{upsert:false})
 
 const invMessage = result0.invData.invoiceMessage
 console.log(compId)
 console.log(result1)


//////////////////////////////

    console.log("invoice initiated")
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      port:587,
      auth:{user: process.env.EMAILNAME,pass:process.env.EMAILPASS}
  })
  const image = fs.readFileSync('./public/images/logoW2.png');
      let mailOptions = {
          from:"W2 Marketing" ,
          to:[result1.email+',scott@w2marketing.biz,w2marketing.candace@gmail.com'],
          subject:`${config.COMPANY_NAME} ~ Invoice for: ${result1.companyName}`,        
          
          html:`<body style="margin:2%;padding:1%;text-align:center;background-color:black;color:white">
          <h1>${config.COMPANY_NAME} ~ Invoice Available</h1><br>
          <img style="max-width:25%;transform:translateX(-75%);" src="cid:image1"><br>
          <h3>you can view your invoice at:</h3><br> 
          <a href="https://${config.SITE_URL}/invoiceViewer/${req.url.split('/')[2]}">${config.SITE_URL}/invoiceViewer/${req.url.split('/')[2]}</a><br>
          <p>Dear ${result1.contactName},</p>
         <p>${invMessage}</p>
          <p>Best regards,</p>
          <p>${config.CONTACT_NAME}</p>
          <p>${config.COMPANY_NAME}</p>
        </body>`
        
          ,attachments:[{
            filename:'logoW2.png',
            content: image,
            cid:'image1'
      }]
      };
      console.log(`emailInvoice option: ${req.body.emailInvoice}`)
      if(req.body.emailInvoice=='on'){
      transporter.sendMail(mailOptions,function(error,info){
          if(error){
              console.log("transporter "+error);
  
          }
          else{
          console.log('email sent'+ info.response)
          }
        
        })
}
      }
        res.redirect('../invoice')
        // const messagingServiceSid = 'MG3fbb6ed2b097681e40887cfd1074546a'
      // const numbers = ['+16822414402','+16822305399','+13164612854','+19708159071','+19708045477','+19704059223','+19704056437','+19705766661','+17204292175','+19705902540','+19704054192']
      // numbers.forEach(number => {
      //   twiloClient.messages
      //     .create({
      //       body: 'from coach scott:  '+req.body.message,
      //       messagingServiceSid: messagingServiceSid,
      //       //from: '+18886174452',
      //       to: number
      //     })
      //     .then(message => console.log(`SMS sent to ${message.to}`))
      //     .catch(error => console.error(`Error sending SMS to ${number}:`, error));
      // });
      });



module.exports = router