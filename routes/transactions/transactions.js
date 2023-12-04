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
  router.post('/processTransactions', async (req, res) => {
    console.log("Starting to process transactions");
  
    const transactionCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_transactions');
    const recyclingCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_recycling');
  
    console.log("Collections initialized");
  
    // Normalize Dates to Date.now() timestamp
    const cursor = transactionCollection.find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      console.log("Processing document:", doc);
  
      if (doc.postingDate && typeof doc.postingDate === 'string') {
        const timestamp = new Date(doc.postingDate).getTime();
        console.log("Converting postingDate to timestamp for document ID:", doc._id);
        await transactionCollection.updateOne({ _id: doc._id }, { $set: { postingDate: timestamp } });
        console.log("Updated document ID:", doc._id, "with new timestamp:", timestamp);
      } else {
        console.log("No conversion needed for document ID:", doc._id);
      }
    }
  
    console.log("Date normalization complete");
  
    // ... [rest of your code for removing duplicates and processing transactions]
  
    res.status(200).send('Transactions processed');
    console.log("Processing complete");
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

// router.post('/csvUpload', upload.single('csv'), async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     const data = await csvtojson().fromFile(filePath);

//     const normalizeKey = (key) => {
//       const lowerKey = key.toLowerCase().trim();
//       const mappings = {
//         'transaction id': 'transactionId',
//         'posting date': 'postingDate',
//         'effective date': 'effectiveDate',
//         'transaction type': 'transactionType',
//         'amt': 'amount',
//         'check no.': 'checkNumber',
//         'ref no.': 'referenceNumber',
//         'desc': 'description',
//         'transaction cat.': 'transactionCategory',
//         'transaction category': 'transactionCategory',
//         'typ': 'type',
//         'bal': 'balance',
//         'memo note': 'memo',
//         'ext. description': 'extendedDescription',
//         'date': 'postingDate',
//         'description': 'description',
//         'gross': 'amount',
//         'balance': 'balance',
//         'time': 'time',
//         'time zone': 'timeZone',
//         'currency': 'currency',
//         'fee': 'fee',
//         'net': 'net',
//         'from email address': 'emailAddress',
//         'name': 'name',
//         'bank name': 'bankName',
//         'bank account': 'bankAccount',
//         'shipping and handling amount': 'shippingAndHandlingAmount',
//         'sales tax': 'salesTax',
//         'invoice id': 'invoiceId',
//         'reference txn id': 'referenceTxnId'
//       };
//       return mappings[lowerKey] || key;
//     };
////
router.post('/csvUpload', upload.single('csv'), async (req, res) => {
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
  }
    return mappings[key.toLowerCase().trim()] || key;
  };

  const camelCasedData = data.map(item => {
    const normalizedItem = {};
    Object.keys(item).forEach(key => {
      normalizedItem[normalizeKey(key)] = key === 'postingDate' ? new Date(item[key]).getTime() : item[key];
    });
    return normalizedItem;
  });

  await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertMany(camelCasedData, { ordered: false });
  res.redirect('transactions');
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
        res.redirect('transactions');
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
router.post('/processCollection', async (req, res) => {
  try {
      const collection = client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`);
      
      // Fetch all records
      const records = await collection.find({}).toArray();
      console.log(`Fetched ${records.length} records`);

      // Normalize dates and create a map for tracking duplicates
      let duplicatesMap = {};
      records.forEach(record => {
          // Normalize date format (example: YYYY-MM-DD)
          record.postingDate = new Date(record.postingDate).toISOString().split('T')[0];

          // Create a key for identifying duplicates (based on your criteria)
          const duplicateKey = `${record.postingDate}-${record.amount}-${record.description}`;
          if (!duplicatesMap[duplicateKey]) {
              duplicatesMap[duplicateKey] = [];
          }
          duplicatesMap[duplicateKey].push(record);
      });

      console.log('Duplicates map created');

      // Process duplicates
      for (let key in duplicatesMap) {
          if (duplicatesMap[key].length > 1) {
              console.log(`Processing duplicates for key: ${key}`);

              // Sort by 'invClient' presence, retain the one with 'invClient'
              duplicatesMap[key].sort((a, b) => b.invClient ? 1 : -1);
              let recordToKeep = duplicatesMap[key][0];
              console.log(`Retaining record with ID: ${recordToKeep._id}`);

              // Delete other duplicates
              for (let i = 1; i < duplicatesMap[key].length; i++) {
                  await collection.deleteOne({ _id: duplicatesMap[key][i]._id });
                  console.log(`Deleted duplicate with ID: ${duplicatesMap[key][i]._id}`);
              }

              // Optionally update the retained record if needed
              // await collection.updateOne({ _id: recordToKeep._id }, { $set: updatedFields });
          }
      }

      console.log('Collection processing completed successfully');
      res.send('Collection processed successfully.');
  } catch (error) {
      console.error(error);
      res.status(500).send('Error processing collection.');
  }
});

///////////////////////////////////
  module.exports =router