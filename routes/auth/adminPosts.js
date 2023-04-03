const express = require('express');
const router = express.Router();
const fs = require('fs');
const client = require('../../config/mongo');
const multer = require('multer');
const upload =multer({dest:"uploads/"});
const path = require('path');
const  ObjectId  = require('mongodb').ObjectId;
const config = require('../../config/config')


function isAddy(req,res,next){
    if(!req.user){res.redirect('login')}
  if(req.user.isAdmin==true){
    next()}
      else{res.sendStatus(401)}
    }
    router.post('/uploadIntro',upload.single('photo'), function(req,res){
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
        fs.rename(oldFilepath+str2,newFilepath+newName,(error)=>{
      if(error){
        console.log(error);
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
              imgName:bImgName,
              gallery:[
                  {
                galleryImgName: 'save a gallery image',
                galleryImgDesc: 'save a new gallery image before you delte this one',
                imageUrl: 'save a gallery image for this category',
                visible: false,
                rank: 99
                  }
              ]
            });
           }
           catch(error){
             console.log(error);
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

    router.post('/updateGalleryImage', async (req, res) => {
        try {
            await client.connect();
            
            // Retrieve data from the request body
            const introContentId = req.body.introContentId;
            const galleryIndex = parseInt(req.body.galleryIndex);
            const galleryImgName = req.body.galleryImgName;
            const galleryImgDesc = req.body.galleryImgDesc;
            const visible = req.body.visible === 'true'; // Convert string to boolean
    console.log(`id ${introContentId} index: ${galleryIndex}`)
            // Update the gallery image details
            const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_intro_content').updateOne(
                { 
                    _id: new ObjectId(introContentId),
                    [`gallery.${galleryIndex}`]: { $exists: true } // Ensure the element at the specified index exists
                },
                {
                    $set: {
                        [`gallery.${galleryIndex}.galleryImgName`]: galleryImgName,
                        [`gallery.${galleryIndex}.galleryImgDesc`]: galleryImgDesc,
                        [`gallery.${galleryIndex}.visible`]: visible
                    }
                }
            );
    
            // Close the MongoDB connection
            await client.close();
    
            console.log('Gallery image updated successfully', result);
            res.redirect('admin');
        } catch (error) {
            console.error('Error updating gallery image:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    

    router.post('/deleteGalleryImage', async (req, res) => {
        try {
            await client.connect();
            const introContentId = req.body.introContentId;
            const icId = new ObjectId(introContentId);
            const galleryIndex = parseInt(req.body.galleryIndex);
            console.log(galleryIndex,icId);
            const find = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_intro_content').find({_id:icId})
            // Delete the image from the gallery array
            const result = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_intro_content').findOneAndUpdate(
                { _id: icId },
                { $unset: { [`gallery.${galleryIndex}`]: 1 } }, // Unset the gallery element at the specified index
                { new: true }
            );
    
            // Compact the array after deletion
            const result2 = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_intro_content').updateOne(
                { _id: icId },
                { $pull: { gallery: null } }
            );
    
            // Close the MongoDB connection
            await client.close();
    
            console.log('Image deleted successfully',find, result, result2);
            res.sendStatus(200);
        } catch (error) {
            console.error('Error deleting image:', error);
            res.status(500).send('Internal Server Error');
        }
    });
    

router.post('/uploadGalleryImages', upload.single('photo'), async function(req, res) {
    const { galleryImgName, galleryImgDesc } = req.body;
    const imageData = req.file;
    const str = imageData.originalname;
    const ext = str.split('.')[1];
    const introContentId = req.body.introCat;
    const introId = new ObjectId(introContentId);
    const oldFilepath = "../" + config.IMAGE_FP + "/uploads/";
    const newDirectory = "../" + config.IMAGE_FP + "/public/images/intro/" + introContentId + "/";
    const newName = 'gallery_' + Date.now() + "." + ext;
    const newFilepath = path.join(newDirectory, newName);
    const bImgName = "images/intro/" + introContentId + "/" + newName;

    // Check if the directory exists, create it if not
    if (!fs.existsSync(newDirectory)) {
        fs.mkdirSync(newDirectory, { recursive: true });
    }

    fs.rename(oldFilepath + imageData.filename, newFilepath, (err) => {
        if (err) {
            console.log(err);
        }
    });

    try {
        await saveBlog(bImgName, galleryImgName, galleryImgDesc, introId);

        res.redirect('admin');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

async function saveBlog(bImgName, galleryImgName, galleryImgDesc, introContentId) {
    try {
        await client.connect();
        const newBlog = {
            imgGallery: {
                galleryImgName: galleryImgName,
                galleryImgDesc: galleryImgDesc,
                imageUrl: bImgName,
                visible: true,
                rank: 99
            },
            introContentId: introContentId // Include introContentId as an object ID
        };
        await createBlog(client, newBlog);
    } finally {
        await client.close();
    }
}

async function createBlog(client, newBlog) {
    const response = await client.db(config.DB_NAME).collection(config.COLLECTION_SUBPATH + '_intro_content').updateOne(
        { _id: newBlog.introContentId },
        { $addToSet: { "gallery": newBlog.imgGallery } }
    );
    console.log(response);
}



module.exports = router;