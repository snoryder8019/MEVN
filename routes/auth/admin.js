const express = require('express');
const router = express.Router();
const env = require('dotenv').config()
const client = require('../../config/mongo');
const ObjectId = require('mongodb').ObjectId;
const axios = require('axios')
const request = require('request')
const fs = require('fs');
const multer = require('multer');
const { COMPANY_ADDRESS } = require('../../config/config');
const { InsightsQuestionnairesQuestionContextImpl } = require('twilio/lib/rest/flexApi/v1/insightsQuestionnairesQuestion');
const upload =multer({dest:"uploads/"});
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
////////////////////////////////////
router.get('/admin',isAddy,async (req, res)=> {
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
  console.log(response.data)
      res.render('admin',{title:"Admin Page",data:response.data});
  } catch (error) {
    res.status(500).json({error});
  }
});
//////////////////////////////////
// router.get('/admin',isAddy, (req,res) =>{
//     // eslint-disable-next-line no-inner-declarations
//     async function gettingEmails(){
//       try {
//         await client.connect();
//         await getEmails(client);
//       }
//       catch(err){
//         console.log(err);
//       }
//       finally{
//       //  await client.close();
//       }}    
//       gettingEmails().catch(console.error);
//       // eslint-disable-next-line no-inner-declarations
//       async function getEmails(client){
 
//        const user = req.user
//         const blogs= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_blogs').find().toArray();
//         const data = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_intro_content').find().toArray();
//         const options = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_options').findOne()
//    return  res.render('admin',{title:'Admin Page',options:options, blogs:blogs, user:user, data:data})
//   } 
//   })
//////////////////////////////////
router.get('/inventory',isAddy, (req,res) =>{ 
    // eslint-disable-next-line no-inner-declarations
    async function gettingEmails(){
     try {
      await client.connect();
      await getEmails(client);
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
   ///////
  gettingEmails().catch(console.error);
   // eslint-disable-next-line no-inner-declarations
   async function getEmails(client){
     const user = req.user
   const inventory = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_inventory').find().toArray();
    const catagory = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_catagories').find().toArray();   
    res.render('inventory', {title:'Inventory Page', inventory:inventory,catagory:catagory , user:req.user,options:options});      
   } 
   })
///////////////
router.post('/deleteInv',isAddy, (req,res)=>{
  async function deleteInventory(){
    try{
      await client.connect()
      await invGetter(client)
    }catch(err){
      console.log(err)
    }finally{
   console.log('complete')
   await client.close()
    }
  }
  deleteInventory().catch(console.error);
  async function invGetter(client){
    const newId = ObjectId(req.body.invId)
     const results = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_inventory').deleteOne({"_id":newId})
    console.log(results)
  return res.redirect('inventory')
  }
})
///////////////
router.post('/updateInv',isAddy, (req,res)=>{
  console.log('update'+req.body.invId)
  async function updateInventory(){
    try{await client.connect()
    await invUpdater(client,{
name:req.body.name,
originalPost:req.body.ogPost,
price:req.body.price,
catRef:req.body.catRef,
    })}
    catch(err){console.log(err)}
    finally{await client.close()}
  }
  updateInventory().catch(console.error);
  async function invUpdater(client,updateInfo){
    const newId=ObjectId(req.body.invId)
const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_inventory').updateOne({"_id":newId},{$set:updateInfo},{upsert:true})
return res.redirect('inventory')
}
})
//////////
 router.post('/upload',isAddy,upload.single('photo'), function(req,res){
  /*isolate file extention*/
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/blog/"
  const newName = 'blog_Image_'+ Date.now()+"."+ext;
/*^^end^^*/
  const bImgName = "images/blog/"+newName;
  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })
  async function saveBlog(bImgName,data){
    try {
      await client.connect();
      await createBlog(client,{
        bTitle:req.body.title,
        postDate:Date.now(),
        bSubtitle:req.body.subtitle,
        bDetails:req.body.details,
        imgName:bImgName
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,newBlog){
    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_blogs').insertOne(newBlog);
    res.redirect('admin');
    }
   }
)
//////////
router.post('/uploadIntro',isAddy,upload.single('photo'), function(req,res){
  /*isolate file extention*/
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/intro/"
  const newName = 'intro_Image_'+ Date.now()+"."+ext;
/*^^end^^*/
  const bImgName = "images/intro/"+newName;
  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })
  async function saveBlog(bImgName,data){
    try {
      await client.connect();
      await createBlog(client,{
        introHeader:req.body.introHeader,
        postDate:Date.now(),
        introDetails:req.body.introDetails,
        order:0,
        imgName:bImgName
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,newBlog){
    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_intro_content').insertOne(newBlog);
    res.redirect('admin');
    }
   }
)
//////////DELETE BLOGS
router.post('/delBlog',isAddy,(req,res)=>{
  async function deleteBlog(){
    try{
      await client.connect();
      await getBlog(client);  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteBlog().catch(console.error);
  async function getBlog(client){
    const newID =ObjectId(req.body.blogDelete);
  const deleteIt = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_blogs').deleteOne({"_id":newID});
  const data = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_registry').find().toArray();
  const blogs= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_blogs').find().toArray();
  res.redirect('admin');
  }
})
////////////////////
//////////DELETE BLOGS
router.post('/delIntro',isAddy,(req,res)=>{
  async function deleteBlog(){
    try{await getBlog(client);}
    catch(err){console.log(err);}  
  }
  deleteBlog().catch(console.error);

  async function getBlog(client){
    const newID =ObjectId(req.body.introDelete);
    console.log(newID)
  const deleteIt = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_intro_content').deleteOne({"_id":newID});
  //const data = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_registry').find().toArray();
  const blogs= await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_intro_content').find().toArray();
  res.redirect('admin');
  }
})

///////////////
/////////////INVENTORY UPLOADS
router.post('/newItem',isAddy,upload.single('photo'), function(req,res){
  //isolate file extention
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/inventory/"
  const newName = 'inventory_image_'+ Date.now()+"."+ext;
/*^^end^^*/

  const bImgName = "images/inventory/"+newName;

  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })
  async function saveBlog(bImgName,data){
    const pplInfo =req.body.paypalcode; 
    console.log(pplInfo);
    try {
      await client.connect();
      await createBlog(client,{
        name:req.body.inventoryName,
        postDate:Date.now(),
        price:req.body.inventoryPrice,
        details:req.body.inventoryDetails,
        catRef:req.body.catSelect,
        imgName:bImgName,
        shipping:{
        height:req.body.inventoryHeight,
        width:req.body.inventoryWidth,
        depth:req.body.inventoryDepth,
        weight:req.body.inventoryWeight,        
        }
     
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,newBlog){
    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_inventory').insertOne(newBlog);
    res.redirect('admin');
    }
   }
)


//////////////////////
router.post('/postToServices0',isAddy,upload.single('photo'), function(req,res){
  //isolate file extention
  const imageData= req.file;
  const ogStr=0;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/services/"
  const newName = 'svcImg_'+ Date.now()+"."+ext;
/*^^end^^*/

  const bImgName = "images/services/"+newName;

  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
if(err){
  console.log(err);
}
 })
  async function saveBlog(bImgName,data){
 const id0 = req.body.serviceId
 const id =ObjectId(id0)
    try {
      await client.connect();
      await createBlog(client,id,{     
        imgName:bImgName,
        
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveBlog(bImgName).catch(console.error);
   async function createBlog(client,id,newBlog){
    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_services').updateOne({"_id":id},{$set:newBlog},{upsert:false});
   console.log(result)
    res.redirect('services');
    }
   }
)
////////////////////////


/////////SAVE COLORS
router.post('/newColor',isAddy, function(req,res){
  async function saveColor(){
    try {
      await client.connect();
      await createColor(client,{
       postDate:Date.now(),
       colorHex:req.body.clrHex,
      colorTag:req.body.clrTag,
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
   saveColor().catch(console.error);
   async function createColor(client,newColor){
    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_colors').insertOne(newColor);
    res.redirect('admin');
    }
   }
)

////DELETE COLORS
router.post('/delColor',isAddy,(req,res)=>{
  async function deleteColor(){
    try{
      await client.connect();
      await getColor(client);  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteColor().catch(console.error);
  async function getColor(client){
    const newID =ObjectId(req.body.colorDel);
  const deleteIt = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_colors').deleteOne({"_id":newID});
return  res.redirect('admin');
  }
})


//////CATEGOREIS
/////////SAVE CATAGORIES
router.post('/newCat',isAddy, function(req,res){
  async function saveCat(){
    try {
      await client.connect();
      await createCat(client,{
       postDate:Date.now(),
       catName:req.body.catName,
      
      });
     }
     catch(err){
       console.log(err);
     }
     finally{
     await client.close();
   }}
 saveCat().catch(console.error);
   async function createCat(client,newCat){

    const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_categories').insertOne(newCat);
  return  res.redirect('admin');
    }
   }
)

////DELETE CATAGORIES
router.post('/delCat',isAddy,(req,res)=>{
  async function deleteCat(){
    try{
      await client.connect();
      await getCat(client,{
"catRef":"Not_Categorized"
      });  
    }
    catch(err){
      console.log(err);
    }
    finally{
      await client.close();
    }
  }
  deleteCat().catch(console.error);
  async function getCat(client, updateInfo){
    const newID =req.body.catDel;
   const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_catagories').deleteOne({"catName":newID})
  const result2 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_inventory').updateMany({"catRef":newID},{$set:updateInfo},{upsert:true})
    console.log(result+' modded '+ "Deleting Category Name "+ newID+"\n\n result2: "+ result2)
 return res.redirect('admin');
  }
})
router.get('/options2',isAddy, (req,res)=>{
  console.log(config.COLLECTION_SUBPATH)
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
      console.log(body)
    }
  })
  
})

router.get('/options',isAddy,(req,res)=>{
  async function faqGetter(){
    try{
      await client.connect()
    await faqPopulate(client)}
    catch(err){console.log(err)}
    finally{client.close}
  }
  faqGetter().catch(console.error);
  async function faqPopulate(client){
    const user = req.user
    const faqs = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_faqs').find().toArray()
    const options = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_options').find().toArray()
    console.log(options)
    res.render('options',{title:"options", user:user,faqs:faqs, options:options})
  }
})
////////////////////////////
//////////
router.post('/updateBkgrd',upload.single('photo'), function(req,res){
  /*isolate file extention*/
  const imageData= req.file;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/"
  const newName = `background.`+ext;
/*^^end^^*/
  console.log(`saving ${newName} to hard drive`)
  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
    if(err){
      console.log(err);
    }res.redirect('options')
  })
})
//////////
///////////
router.post('/updateLogo',isAddy,upload.single('photo'), function(req,res){
  /*isolate file extention*/
  const imageData= req.file;
  const str = imageData.originalname;
  const str2 = imageData.filename;
  const strSplit= str.split('.');
  const ext = strSplit[1];
  const oldFilepath = "../"+config.IMAGE_FP+"/uploads/";
  const newFilepath = "../"+config.IMAGE_FP+"/public/images/"
  const newName = 'logoW2'+"."+ext;
  /*^^end^^*/

  console.log(`saving ${newName} to hard drive`)
  fs.rename(oldFilepath+str2,newFilepath+newName,(err)=>{
    if(err){
  console.log(err);
}res.redirect('options')
 })
})
 
//////////
//////////////////



//
router.post('/updateOption',isAddy,(req,res)=>{
async function newOptions(){
  try{
    await optionsSwap(client,{
    companyName:req.body.companyName,
    companyContact:req.body.companyContact,
    companyAddress:req.body.companyAddress,
    companyPaypal:req.body.companyPaypal,
    introQuote :req.body.introQuote,
    introMOTD:req.body.introMOTD,
    aboutFiller:req.body.aboutFiller,
    custom404Message:req.body.custom404Message,
    paypalEmail:req.body.paypalEmail,
    blogTitle:req.body.blogTitle,
    inventoryTitle:req.body.inventoryTitle,
    productLinkback:req.body.productLinkback,
    purchaseTerms:req.body.purchaseTerms
    })
  }
  catch(err){console.log(err)}
}
newOptions().catch(console.error);
async function optionsSwap(client,data99){
  console.log(req.body)
  const id = ObjectId(req.body._id)
  console.log(id)
  const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_options').updateMany({"_id":id},{$set:data99},{upsert:false})
  console.log(result)
}
res.redirect('options')
})

router.post('/newFAQ',isAddy,(req,res)=>{
async function newFAQs(){
  try{
    await client.connect()
    await faqAdd(client,{
      faqQ:req.body.faq,
      faqA:req.body.faqAnswer
    })
  }
  catch(err){console.log(err)}
  finally{await client.close()}
}
newFAQs().catch(console.error);
async function faqAdd(client,faqOptions){
  const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_faqs').insertOne(faqOptions)
  console.log(result)
}
res.redirect('options')
})

router.post('/delFaq',isAddy, (req,res)=>{
  async function delFaqs(){
    try{
      await client.connect()
      await faqDeleter(client)
    }
    catch(err){console.log(err)}
    finally{await client.close()}
  }
  delFaqs().catch(console.error);
  async function faqDeleter(client){
    const newID =ObjectId(req.body.faqId);
  const deleteIt = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_faqs').deleteOne({"_id":newID});
  console.log(deleteIt)
  res.redirect('options')
}
})

//first graph api to facebook
//refactor in its own file and build out from w2 mongo microsvc
router.get('/ptf',isAddy, (req, res) => { 
  const ahref = req.body.ahref
  const headline = req.body.headline
  const accessToken = process.env.FBPAT
  const message = `heres a message`;
 const imgUrl = req.body.imgUrl
 let image = null;
  const options = {
    method: 'POST',
    url: `https://graph.facebook.com/v16.0/115893380202482/photos`,
    qs: {access_token: 'EAAHWXokkDBABAEpWhAvZAMY12JPMMe81pE5qCyvR0olHbyZARgfeoE9vtuWbhb3oz1JcfPJOJUXGRdbm299esSt5r1Jsik9wLfWKT4HRFYA3FkRZBZBE9DpqZA5FrtwnUUozSkfPeGOBQnZBiOZAgg5i02XoXQVaCtUrao1OeAbtpFBmwQqCzfdzx2DJlZCDfVlmR989Grv6ZCuZCHQmwqRPvJP1sgzMkZClzgZD'},  
  message:"message to graph api with photo"
  };

  request(options, (error, response, body) => {
    if (error) {
      console.log(`Error: ${error}`);
      res.status(500).send(`Error: ${error}`);
    } else {
      console.log(`Response: ${response.statusCode} ${response.statusMessage}`);
      console.log(`Body: ${JSON.stringify(body)}`);
    
      res.redirect('admin')
    }
  });
  
});



const oldKeyMap = {
  TRNTYPE: 'transactionType',
  DTPOSTED: 'postingDate',
  TRANAMT: 'amount',
  FITID: 'transactionId',
  MEMO:'memo'
};

async function migrateKeys(client) {


  try {
      const db = client.db(config.DB_NAME);
    const collection = db.collection(`${config.COLLECTION_SUBPATH}_transactions`);

    // Perform key updates for each key in the oldKeyMap
    for (const oldKey in oldKeyMap) {
      const newKey = oldKeyMap[oldKey];

      const query = { [oldKey]: { $exists: true } };
      const update = { $rename: { [oldKey]: newKey } };
      const options = { multi: true };

      const result = await collection.updateMany(query, update, options);

      console.log(`Key "${oldKey}" updated to "${newKey}" in ${result.modifiedCount} documents.`);
    }

    console.log('Key migration complete.');
  } catch (err) {
    console.error('Error occurred:', err);

}}

// router.post('/keysUpdateUtility',isAddy,migrateKeys)


router.post('/keysUpdateUtility', isAddy, (req, res) => {
  async function kUU() {
    try {
      await migrateKeys(client);
    } catch (error) {
      console.log(error);
    }
  }

  kUU().catch(console.error);
  res.redirect('transactions')
});

  

module.exports = router;