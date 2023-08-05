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
    4:'_transactions'
  };
//
  router.get('/dashboard',isAddy,getHandler(invCollections,'dashboard'));

  router.post('/markPaid',isAddy, (req,res)=>{
  async function markPaid(){
    const payStatus = {
      status:{
        draft:false,
        paid:true,
        delinquent:false,
        paymentDate:Date.now(),
        }
    }
    try{await postPayment(client,{
        id:ObjectId(req.body._id),
       payStatus

    })}
    catch(err){console.log(err)}
  }
  markPaid().catch(console.error);
  async function postPayment(client,payParams){
    const pay = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:payParams.payStatus},{$upsert:false})

  res.redirect('dashboard')
}
  })

  
  router.post('/unPaid',isAddy, (req,res)=>{
    async function markPaid(){
      const payStatus = {
          paymentDate:Date.now(),
          status:{
              draft:false,
              paid:false,
              delinquent:false
          }
      }
      try{await postPayment(client,{
          id:ObjectId(req.body._id),
         payStatus
  
      })}
      catch(err){console.log(err)}
    }
    markPaid().catch(console.error);
    async function postPayment(client,payParams){
      const pay = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:payParams.payStatus},{$upsert:false})

    res.redirect('dashboard')
  }
    })




    router.post('/reDraft',isAddy, (req,res)=>{
      ////////
     
      ////////
      async function markDraft(){
        const cliId=req.body._id_client.split('|')[0]
        const invId = req.body.inv_id
        const draftStatus = {              
          status:{
            draft:true,
            paid:false,
            delinquent:false
          }
        }
        try{await reDraft(client,{
          id:ObjectId(req.body._id),
           draftStatus,
           invId:ObjectId(invId),
           cliId:ObjectId(cliId),
    
        })}
        catch(err){console.log(err)}
      }
      markDraft().catch(console.error);
      async function reDraft(client,params){

       const cliResult = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_clients`).findOne({"_id":params.cliId})
       const invResult = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).findOne({"_id":params.invId})
       const currentBal = invResult.invTotal
    
       const newBalance0 = cliResult.status.balance-currentBal
       const newBalance = {status:{active:true,balance:newBalance0}}

       const finalCli = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_clients`).updateOne({"_id":params.cliId},{$set:newBalance},{upsert:false})
       const finalInv = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":params.invId},{$set:params.draftStatus},{upsert:false})
 
       // const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_invoice`).updateOne({"_id":payParams.id},{$set:params.status},{$upsert:false})
        res.redirect('dashboard')
    }
      })





  ////////////////W2 ADMIN DASHBOARD ABOVE!!!!!



router.post('/notify',(req,res)=>{
async function main(){  

  try { 
    const today = new Date() 
   
    await createUser(client,{     
     noticeLast:{today,type:Date}         
   },
   ObjectId(req.body.notify_cust_id),
ObjectId(req.body.notify_inv_id))
}
catch(err){
  console.log(err)
}}

main().catch(console.error);  

async function createUser(client,options,custid,invid){
 const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_clients").updateOne({"_id":custid},{$set:options},{upsert:false});
 let result0 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_invoice").findOne({"_id":invid});

 let result1 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+"_clients").findOne({"_id":custid});
 const invMessage = "if you have any questions or think I have made an error, please let me know, Thank you!"




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
          to:[result1.email+',w2marketing.scott@gmail.com,w2marketing.candace@gmail.com'],
          subject:`${config.COMPANY_NAME} ~ Courtesy Reminder for: ${result1.companyName}`,        
          
          html:`<body style="margin:2%;padding:1%;text-align:center;background-color:black;color:white;">
          <img style="max-width:25%;transform:translateX(-75%);" src="cid:image1"><br>
          <h2>${config.COMPANY_NAME} ~ Avoid any Late Fees</h2><br>
          <h3>you can view your invoice at:</h3><br> 
          <a href="https://${config.SITE_URL}/invoiceViewer/${result0._id}">${config.SITE_URL}/invoiceViewer/${result0._id}</a><br>
          <h3>Your account activity can be viewed here: </h3><br>
          <a href="https://${config.SITE_URL}/clientDashboard/${result1._id}">${config.SITE_URL}/clientDashboard/${result1._id}</a><br>
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
           transporter.sendMail(mailOptions,function(error,info){
          if(error){
              console.log("transporter "+error);  
          }
          else{
          console.log('email sent'+ info.response)
          }        
        })
      }
        res.redirect('../dashboard')
   });

router.post('/updateTicket',(req,res)=>{
  async function ticketUpdate(){
    const id =ObjectId(req.body.ticketId)
    try{await ticketGrab(client,{   
    devNotes:req.body.devNotes, }   
    ,id)}
    catch (error){console.log(error)}
  }
  ticketUpdate().catch(console.error);
  async function ticketGrab(client,options,id){
   const response = await client.db(config.DB_NAME).collection('tickets_submission').updateOne({"_id":id},{$set:options},{upsert:false})
    res.redirect('ticketsDashboard')
  }
})
router.post('/unresolvedTicket',(req,res)=>{

  async function ticketUpdate(){
    const id =ObjectId(req.body.ticketId)
    try{await ticketGrab(client,{
      status:{open:false,resolved:false,resolveDate:Date.now()},
 }   
    ,id)}
    catch (error){console.log(error)}
  }
  ticketUpdate().catch(console.error);
  async function ticketGrab(client,options,id){
   const response = await client.db(config.DB_NAME).collection('tickets_submission').updateOne({"_id":id},{$set:options},{upsert:false})
    res.redirect('ticketsDashboard')
  }
})
router.post('/closeTicket',(req,res)=>{

  async function ticketUpdate(){
    const id =ObjectId(req.body.ticketId)
    try{await ticketGrab(client,{
      status:{open:false,resolved:true,resolveDate:Date.now()},
  }   
    ,id)}
    catch (error){console.log(error)}
  }
  ticketUpdate().catch(console.error);
  async function ticketGrab(client,options,id){
   const response = await client.db(config.DB_NAME).collection('tickets_submission').updateOne({"_id":id},{$set:options},{upsert:false})
    res.redirect('ticketsDashboard')
  }
})
router.post('/deleteTicket',(req,res)=>{

  async function ticketUpdate(){
    const id =ObjectId(req.body.ticketId)
    try{await ticketGrab(client,id)}
    catch (error){console.log(error)}
  }
  ticketUpdate().catch(console.error);
  async function ticketGrab(client,id){
   const response = await client.db(config.DB_NAME).collection('tickets_submission').deleteOne({"_id":id})
    res.redirect('ticketsDashboard')
  }
})




module.exports = router