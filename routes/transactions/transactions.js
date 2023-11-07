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
// Combined endpoint to normalize dates, remove duplicates, and retain invClient key
router.post('/processTransactions', async (req, res) => {
  const transactionCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_transactions');
  const recyclingCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_recycling');

  // Normalize Dates to Date.now() timestamp
  const cursor = transactionCollection.find({});
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    await transactionCollection.updateOne({ _id: doc._id }, { $set: { postingDate: Date.now() } });
  }

  // Remove duplicates and move them to _recycling
  const seen = new Map();
  const aggCursor = transactionCollection.aggregate([
    { $group: { _id: "$transactionId", count: { $sum: 1 }, docs: { $push: "$$ROOT" } } },
    { $match: { count: { $gt: 1 } } }
  ]);

  while (await aggCursor.hasNext()) {
    const group = await aggCursor.next();
    const duplicates = group.docs.slice(1); // Keep one, move the rest

    for (const duplicate of duplicates) {
      // Retain invClient information if it exists
      if (duplicate.invClient) {
        await recyclingCollection.insertOne({ ...duplicate, retainedInvClient: duplicate.invClient });
      } else {
        await recyclingCollection.insertOne(duplicate);
      }
      await transactionCollection.deleteOne({ _id: duplicate._id });
    }
  }

  // Filter and retain non-duplicate transactions with invClient key
  const allTransactions = await transactionCollection.find({}).toArray();
  const uniqueTransactions = allTransactions.filter(t => seen.has(t.transactionId) ? false : seen.set(t.transactionId, true));

  await transactionCollection.deleteMany({});
  await transactionCollection.insertMany(uniqueTransactions);

  res.status(200).send('Transactions processed');
});

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

    const normalizeKey = (key) => {
      const lowerKey = key.toLowerCase().trim();
      const mappings = {
        'transaction id': 'transactionId',
        'posting date': 'postingDate',
        'effective date': 'effectiveDate',
        'transaction type': 'transactionType',
        'amt': 'amount',
        'check no.': 'checkNumber',
        'ref no.': 'referenceNumber',
        'desc': 'description',
        'transaction cat.': 'transactionCategory',
        'transaction category': 'transactionCategory',
        'typ': 'type',
        'bal': 'balance',
        'memo note': 'memo',
        'ext. description': 'extendedDescription',
        'date': 'postingDate',
        'description': 'description',
        'gross': 'amount',
        'balance': 'balance',
        'time': 'time',
        'time zone': 'timeZone',
        'currency': 'currency',
        'fee': 'fee',
        'net': 'net',
        'from email address': 'emailAddress',
        'name': 'name',
        'bank name': 'bankName',
        'bank account': 'bankAccount',
        'shipping and handling amount': 'shippingAndHandlingAmount',
        'sales tax': 'salesTax',
        'invoice id': 'invoiceId',
        'reference txn id': 'referenceTxnId'
      };
      return mappings[lowerKey] || key;
    };

    const camelCasedData = data.map(item => {
      const normalizedItem = {};
      for (const key in item) {
        const normalizedKey = normalizeKey(key);
        normalizedItem[normalizedKey] = item[key];
      }
      if (normalizedItem.emailAddress) {
        normalizedItem.description = `${normalizedItem.description} (Email: ${normalizedItem.emailAddress})`;
      }
      return normalizedItem;
    });

    console.log(`Number of transactions in CSV: ${data.length}`);

    // Temporarily comment out this line to bypass deduplication:
    // const uniqueTransactions = removeDuplicateTransactions(camelCasedData);
    // console.log(`Number of unique transactions: ${uniqueTransactions.length}`);

    const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertMany(camelCasedData, { ordered: false });

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
  router.post('/updateTransCat/:id', async (req, res) => {
    const url = req.url.split('/')[2];
    const id = ObjectId(url);
    const options = req.body;
    
    try {
        await transPlant(client, id, options);
        res.status(200).send('Updated successfully.');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error updating transaction.');
    }
});

async function transPlant(client, id, body) {
    const result = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).updateOne({"_id": id}, { $set: body }, { upsert: false });
    console.log(result);
}

router.post('/delTrans',(req,res)=>{
  async function transAdd(){
  const transId = req.body.transId
  const id =ObjectId(transId)   
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
router.post('/manualTransaction', async (req, res) => {
  const options = {
      postingDate: req.body.postingDate,
      amount: req.body.amount,
      description: req.body.description,
      invoiceClient: req.body.invClient  // renamed to a more descriptive key
  };

  console.log(options);

  try {
      const response = await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertOne(options);
      console.log(response);
      res.redirect('transactions');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error adding transaction.');
  }
});

////////////////////////

///////////////////////////////////
  module.exports =router