const express = require('express');
const router = express.Router();
const axios = require('axios');
const client = require('../../config/mongo');
const ObjectId = require('mongodb').ObjectId;

router.get('/galleryItem', async (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    console.log('gallery called', clientIp);
    try {
        const { introId, galleryIndex } = req.query; // Use req.query to access query parameters
        console.log()
        const introIdObj = new ObjectId(introId);
        await client.connect();
        const db = client.db(config.DB_NAME);
        const collection = db.collection(config.COLLECTION_SUBPATH + '_intro_content');
        
        // Find the intro document based on introId
        const introDocument = await collection.findOne({ "_id": introIdObj });
        console.log(introDocument)
        // Check if introDocument and galleryIndex are valid
        if (introDocument && introDocument.gallery && introDocument.gallery.length > galleryIndex) {
            // If valid, send the corresponding gallery item data
            res.json(introDocument.gallery[galleryIndex]);
        } else {
            res.status(404).send("Gallery item not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});



router.get('/introDetails',async (req, res)=> {
    const clientIp = req.headers['x-forwarded-for'] || req.ip;
    console.log(clientIp)
    try {
  const data={
          subpath:config.COLLECTION_SUBPATH,
          dbName:config.DB_NAME,
          collections:{
          [0]:"_blogs",
          [1]:"_inventory",
          [2]:"_intro_content",
          [3]:"_users"    
  }};
const cleanUrl = req.query.id;
  const data2 = {
    subpath: config.COLLECTION_SUBPATH,
    dbName: config.DB_NAME,
    ext:"_intro_content",
    filter:cleanUrl
  }
  
  const response2 = await axios.get(config.DB_URL + '/api/readOneF', { params: data2 });

        const response = await axios.get(config.DB_URL+'/api/readManyD',{params:data});
   
       // console.log(response.data)
     res.render('introDetails',{data:response.data,data2:response2.data});
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  });
  router.get('/galleryEditor', (req,res)=>{
    console.log('galleryEditor')
  })
module.exports = router;