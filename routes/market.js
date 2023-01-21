/* eslint-disable no-inner-declarations */
const express = require('express');
const router = express.Router();
const client = require('../config/mongo');
const dbName= 'w2Apps';
const ObjectId = require('mongodb').ObjectId;
//////////////////middleware
router.use((req,res,next)=>{

next();
})
////////////////////////////////////
router.get('/market', (req,res) =>{  
  console.log("user connect on market"+req.user)
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
    //calling the function
    gettingBlogs().catch(console.error);
    async function getBlogs(client){
     const user = req.user
console.log('user detected')
 const session = req.session.user
  const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
  const data = await client.db(dbName).collection('nm_inventory').find().toArray();
if(req.user){
  const cart = await client.db(dbName).collection('users').findOne({"_id":ObjectId(user._id)});
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
 return res.render('market', {title:"W2 Marketing Services",cartTotal:cartTotal,cart:cart,user:user, data:data, catagory:catagory, session:session})
  } else{
    console.log('no user or session user')
   return res.render('market', {title:"W2 Marketing Services",user:user, data:data, catagory:catagory, session:session})

  }
  }

   }
)
router.get('/marketOp', (req,res)=>{
 
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
    //calling the function
    gettingBlogs().catch(console.error);
    async function getBlogs(client){
      const user= req.user
      const catagory = await client.db(dbName).collection('nm_catagories').find().toArray();
      const responses= req.url.slice(req.url.trim().indexOf('=')+1);
      const data = await client.db(dbName).collection('nm_inventory').find({"catRef":responses}).toArray();
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
       
        const cartItemsID = [];
        for(let i =0;i<cart.cart.length;i++){
          let pushItem = [
            cart.cart[i].$nm_inventory
          ]
          cartItemsID.push(pushItem)
          
        }              
        return res.render('marketOp',{title:"filtered: "+responses,cartTotal:cartTotal,responses,user:user,cart:cart ,catagory:catagory, data:data,session:req.session})
        }
       else if(req.session.user){
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
         
          const cartItemsID = [];
          for(let i =0;i<cart.cart.length;i++){
            let pushItem = [
              cart.cart[i].$nm_inventory
            ]
            cartItemsID.push(pushItem)
            
          }              
          return res.render('marketOp',{title:"filtered: "+responses,cartTotal:cartTotal,responses,user:req.session.user,cart:cart ,catagory:catagory, data:data,session:req.session})
          } 
        else{
     return res.render('marketOp',{title:"filtered: "+responses,user:user, catagory:catagory, data:data,session:req.session})

    }
        }})


router.get('/productID/:_id', (req,res)=>{
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
      const newID =ObjectId(req.params._id);
       const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
       if(req.user){
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
        return res.render('productID',{title:"Service Details: " ,cartTotal:cartTotal,cart:cart,user:user, data:data,session:req.session})
        }
        else if (req.session.user) {
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
     return res.render('productID', {title:"Service Details: ",cartTotal:cartTotal,cart:cart,user:req.session.user, data:data, session:req.session})
      
        }
        
        
        else{
         return res.render('productID',{title:"Service Details: " ,user:user, data:data,session:req.session})
          
        }
      }})
      
      router.post('/addToCart',(req,res)=>{
        /////////
        async function gettingCart(data){
  const user= req.user
  try {
    await client.connect();
    await getCart(client);
  }
  catch(err){
    console.log(err)
  }
  finally{
    await client.close();
  }}
  gettingCart().catch(console.error);
  
  async function getCart(client){
    const user = req.user
const session = req.session
    const prodId = ObjectId(req.body.prodId)
    if (session.user){
      console.log('session id')
      let newID =ObjectId(session.user._id);
      await client.db(dbName).collection('users').updateOne(
        {"_id":newID},{
          $push:{ cart:{
            nm_inventory :  prodId,
            price:req.body.prodPrice,
            name:req.body.prodName,
            img:req.body.prodImg}
          }
  });
    }
    if (user){
      console.log('user id')
    let newID =ObjectId(user._id);
    await client.db(dbName).collection('users').updateOne(
      {"_id":newID},{
        $push:{ cart:{
          nm_inventory :  prodId,
          price:req.body.prodPrice,
          name:req.body.prodName,
          img:req.body.prodImg}
        }
});
    }
    // const data = await client.db(dbName).collection('nm_inventory').findOne({"_id":newID});
    

////////
return res.redirect(req.get('referrer'));
}}
)
//////DELETE CART ITEM **Stable 10-5-22
router.post('/delCart',(req,res)=>{
  const user = req.user
  const session = req.session
  async function deleteCart(){
    try{
      await client.connect();
      await getCart(client);  
    }
    catch(err){
      console.log("error"+err);
    }
    finally{
      await client.close();
    }
  }
  deleteCart().catch(console.error);
  async function getCart(client){
  
if(session.user){
    const cartFind = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.session.user._id)});
    const delItem = await client.db(dbName).collection('users').updateOne(
    {"_id":ObjectId(session.user._id)},
    {$pull:{"cart":{"name":req.body.cartNum}}});  
    }
if(user){
    const cartFind = await client.db(dbName).collection('users').findOne({"_id":ObjectId(req.user._id)});
    const delItem = await client.db(dbName).collection('users').updateOne(
    {"_id":ObjectId(req.user._id)},
    {$pull:{"cart":{"name":req.body.cartNum}}});  
    }
    console.log(req.body.cartNum[0].name)
    console.log(req.body.cartNum)
 
   return res.redirect(req.get('referrer'));
  }
})
//////////

module.exports = router;