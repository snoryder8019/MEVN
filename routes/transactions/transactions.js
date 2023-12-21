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
  
  ////////////////////////////
  router.get('/transSort/:month/:year', async (req, res) => {
    console.log("Endpoint /transSort/:month/:year called");

    const { month, year } = req.params;
    const startDate = new Date(Date.UTC(year, month - 1, 1));
const endDate = new Date(Date.UTC(year, month, 1));

    console.log(`Fetching transactions for ${month} ${year}...`);

    const transactionCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_transactions');
    const transactions = await transactionCollection.find({
        postingDate: { $gte: startDate, $lt: endDate }
    }).toArray();

    console.log("Transactions fetched:", transactions);

    // Fetch data from _clients collection
    const clientsCollection = client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH+'_clients');
    const clients = await clientsCollection.find({}).toArray();

    console.log("Clients fetched:", clients);

    console.log(`Found ${transactions.length} transactions.`);

    res.render('transSort', { transactions, clients, month, year });
});

////////////
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
      // Convert dates to BSON format
      if (['postingDate', 'effectiveDate'].includes(key)) {
        normalizedItem[normalizeKey(key)] = new Date(item[key]);
      } else {
        normalizedItem[normalizeKey(key)] = item[key];
      }
    });
    return normalizedItem;
  });

  await client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`).insertMany(camelCasedData, { ordered: false });
  res.redirect('transactions');
});

///////////////////////////////////////////////


router.get('/convertDatesToBson', async (req, res) => {
  const transactionCollection = client.db(config.DB_NAME).collection(`${config.COLLECTION_SUBPATH}_transactions`);

  const transactions = await transactionCollection.find({}).toArray();
  console.log(`Found ${transactions.length} transactions. Starting conversion...`);

  let convertedCount = 0;
  for (const transaction of transactions) {
    const updatedFields = {};
    if (transaction.postingDate && typeof transaction.postingDate === 'string') {
      updatedFields.postingDate = new Date(transaction.postingDate);
    }
    if (transaction.effectiveDate && typeof transaction.effectiveDate === 'string') {
      updatedFields.effectiveDate = new Date(transaction.effectiveDate);
    }

    if (Object.keys(updatedFields).length > 0) {
      await transactionCollection.updateOne({ _id: transaction._id }, { $set: updatedFields });
      console.log(`Transaction ID ${transaction._id} updated with new dates.`);
      convertedCount++;
    }
  }

  console.log(`Date conversion complete. Total converted: ${convertedCount}.`);
  res.send(`Date conversion complete. Total converted: ${convertedCount}.`);
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
////////
router.post('/invClientAssign', (req, res) => {
  async function assignInvClient() {
    const transactionId = ObjectId(req.body.transactionId); // Assuming you have a way to send transactionId
    const companyName = req.body.companyName;
    
    try {
      await updateInvClient(client, transactionId, companyName);
      console.log(`Updated invClient for transactionId: ${transactionId}, companyName: ${companyName}`);
    } catch (error) {
      console.error(error);
    }

    // Redirect to the referring page
    res.redirect(req.get('Referrer') || 'transactions');
  }

  assignInvClient().catch(console.error);
});

async function updateInvClient(client, transactionId, companyName) {
  return client.db(config.DB_NAME)
               .collection(`${config.COLLECTION_SUBPATH}_transactions`)
               .updateOne(
                 { _id: transactionId },
                 { $set: { invClient: companyName } }
               );
}


////////


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


///////////////////////////////////
  module.exports =router