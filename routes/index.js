/* eslint-disable no-inner-declarations */
var express = require('express');
var router = express.Router();
var client = require('../config/mongo');

const ObjectId = require('mongodb').ObjectId;
const dbName = 'w2Apps'


router.get('/service-agreements',(req,res)=>{
  return res.render('service-agreements')
 })   
/* GET home page. */
router.get('/',(req, res)=> {
  async function gettingBlogs(){
    try {
     await client.connect();
     await getBlogs(client);
    }
    catch(err){
      console.log(err)
    }
    finally{
    await client.close();
  }}
  gettingBlogs().catch(console.error);
  async function getBlogs(client){
const user= req.user






    const blogs = await client.db(dbName).collection('blogs').find().toArray();
    const data = await client.db(dbName).collection('nm_inventory').find().toArray();
    if(user){
    const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
            //////total cart items
            const cartArray = []
            var cartTotal=0;     
            function cartGather(){
             for (let i=0;i<cart.cart.length;i++){
                 cartArray.push(parseInt(cart.cart[i].price))
                 cartTotal +=cartArray[i]
             }
           }
             cartGather()
                    console.log(cartTotal)
             console.log(cartArray)
          ////END CART TOTALS
    res.render('index', {title:'Welcome',cartTotal:cartTotal,cart:cart,user:user, data:data, blogs:blogs})
  }else if (req.session.user){
  const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.session.user._id)});
  //////total cart items
  const cartArray = []
  var cartTotal=0;

  function cartGather(){
   for (let i=0;i<cart.cart.length;i++){
       cartArray.push(parseInt(cart.cart[i].price))
       cartTotal +=cartArray[i]
   }
 }
   cartGather()
          console.log(cartTotal)
   console.log(cartArray)
////END CART TOTALS
res.render('index', {title:'Welcome',cartTotal:cartTotal,cart:cart,user:user, data:data, blogs:blogs})


}
  else{
      res.render('index', {title:'Welcome',user:null, data:data, blogs:blogs})

    }
    }
});

router.get('/faqs',(req,res)=>{
  async function faqFe(){
    try{await client.connect()
    await faqGetter(client)}
    catch(err){console.log(err)}
    finally{client.close()}
  }
  faqFe().catch(console.error);
  async function faqGetter(client){
const faqs = await client.db(dbName).collection('nm_faqs').find().toArray()
res.render('faqs',{faqs:faqs})
  }
})
router.get('/about',(req,res)=>{
  res.render('about')
})

module.exports = router;
