const express = require('express');
const router = express.Router();
const client = require('../../config/mongo');
const multer = require('multer');
const csvtojson = require('csvtojson');
const upload =multer({dest:"uploads/"});
const ObjectId = require('mongodb').ObjectId;
const config = require('../../config/config')
const getHandler  = require('../crud/getHandler');
/////////////////////////////////
router.get('/',(req,res)=>{
    
})
////////////////////////////////////
//AUTH AND ENVIRONMENT MIDDLEWARE
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
  //////////////////////////////
  function removeDuplicateTransactions(transactions) {
    const seen = new Set();
    return transactions.filter(transaction => {
      const duplicate = seen.has(transaction.id);
      seen.add(transaction.id);
      console.log(duplicate)
      return !duplicate;
    });
  }
  //////////////////////////////
  router.post('/adjustDates', async (req, res) => {
    const collection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_transactions');
    const cursor = collection.find({});
    
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      let adjustedDate = null;
  
      if (doc.postingDate) {
        // Handle MM-DD-YYYY
        if (/^\d{2}-\d{2}-\d{4}$/.test(doc.postingDate)) {
          adjustedDate = doc.postingDate;
        } 
        // Handle M/D/YYYY
        else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(doc.postingDate)) {
          const [month, day, year] = doc.postingDate.split('/');
          adjustedDate = `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
        }
      }
  
      if (adjustedDate) {
        await collection.updateOne({ _id: doc._id }, { $set: { postingDate: adjustedDate } });
      }
    }
  
    res.status(200).send('Dates adjusted');
  });
  
  ////////////////////////////
  ////////////////////////////

  router.post('/moveDuplicates', async (req, res) => {
    console.log("Endpoint /moveDuplicates called");
  
    const transactionCollection = client.db(client.DB_NAME).collection(config.COLLECTION_SUBPATH+'_transactions');
    const recyclingCollection = client.db(client.DB_NAME).collection(config.COLLECTION_SUBPATH+'_recycling');
  
    console.log("Aggregating transactions to find duplicates...");
  
    const aggCursor = transactionCollection.aggregate([
      { $group: { _id: "$transactionId", count: { $sum: 1 }, docs: { $push: "$$ROOT" } } },
      { $match: { count: { $gt: 1 } } }
    ]);
  
    while (await aggCursor.hasNext()) {
      const group = await aggCursor.next();
      const duplicates = group.docs.slice(1); // Keep one, move the rest
  
      console.log(`Found duplicates for transactionId: ${group._id}`);
  
      for (const doc of duplicates) {
        console.log(`Moving document with _id: ${doc._id} to _recycling collection`);
        await recyclingCollection.insertOne(doc);
        await transactionCollection.deleteOne({ _id: doc._id });
      }
    }
  
    console.log("Finished moving duplicates.");
    res.status(200).send('Duplicates moved');
  });
  ////////////////////////////
  ////////////////////////////
  
  router.get('/transSort/:month/:year', async (req, res) => {
    console.log("Endpoint /transactions/:month/:year called");
  
    const { month, year } = req.params;
    const startDate = new Date(`${year}-${month}-01T00:00:00Z`);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
  
    console.log(`Fetching transactions for ${month} ${year}...`);
  
    const transactionCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_transactions');
    const transactions = await transactionCollection.find({
      postingDate: {
        $gte: startDate,
        $lt: endDate
      }
    }).toArray();
  
    console.log(`Found ${transactions.length} transactions.`);
  
    // Render the transactions using EJS
    res.render('transSort', { transactions, month, year });
  });
  
  ////////////////////////////
///////////////////////////////////////
///~~~~~~~~~~~TRANSACTIONS.EJS~~~~~~~~~~~~~~///
const invCollections = {
    0: '_services',
    1: '_clients',
    2:'_invoice',
    3:'_options',
    4:'_transactions',
    5:'_transCat'
  };
 router.get('/transactions',isAddy,getHandler(invCollections,'transactions'));

// Function to convert a single key from space-separated to camel case
function camelCaseKey(key) {
  const words = key.split(' ');
  const camelCaseWords = [words[0].toLowerCase(), ...words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())];
  return camelCaseWords.join('');
}

router.post('/csvUpload', upload.single('csv'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const data = await csvtojson().fromFile(filePath);

    // Convert keys to camel case for each object in the 'data' array
    const camelCasedData = data.map(item => {
      const camelCasedItem = {};
      for (const key in item) {
        const camelCasedKey = camelCaseKey(key);
        camelCasedItem[camelCasedKey] = item[key];
      }
      return camelCasedItem;
    });

    // Remove duplicates
    const uniqueTransactions = removeDuplicateTransactions(camelCasedData);

    // MongoDB client setup
    // const client = new client(config.DB_URL, { useUnifiedTopology: true });
    // await client.connect();

    const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertMany(uniqueTransactions);

    console.log(result);
    res.redirect('transactions');
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

    ///////////////////////////////////////////
router.post('/addTransCat',(req,res)=>{
  async function transAdd(){
    const id = ObjectId(req.body._id)
    try{transPlant(client,id,{
    transType: req.body.transType
    })}
    catch (error){console.log(error)}
    }
  
  transAdd().catch(console.error);
  async function transPlant(client,options){
    const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transCat`).insertOne(options)

 res.redirect('transactions')
}}
  )
router.post('/updateTransCat/:id',(req,res)=>{
  async function transAdd(){
    const url = req.url.split('/')[2]
  const id = ObjectId(url)
    const options = req.body
    try{transPlant(client,id,options)}
    catch (error){console.log(error)}
    }
    
    transAdd().catch(console.error);
    async function transPlant(client,id,body){
      const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).updateOne({"_id":id},{$set:body},{upsert:false})
      console.log(result)
  res.redirect('../transactions')
  }}
  )
router.post('/delTrans',(req,res)=>{
  async function transAdd(){
  const transId = req.body.transId
  const id = ObjectId(transId)   
    try{transPlant(client,id)}
    catch (error){console.log(error)}
    }
    
    transAdd().catch(console.error);
    async function transPlant(client,id){
      const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).deleteOne({"_id":id})
      console.log(result)
  res.redirect('../transactions')
  }}
  )

//////////
router.post('/manualTransaction',(req,res)=>{
  async function createTrans(){
    const options = req.body
    console.log(options)
    try{addTrans(client,options)}
    catch(error){console.log(error)}
  }
  createTrans().catch(console.error);
  async function addTrans(client,options){
    const response = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertOne(options)
  console.log(response)
  res.redirect('transactions')
  }
})
////////////////////////

///////////////////////////////////
  module.exports =router