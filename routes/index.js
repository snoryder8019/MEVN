const express = require('express');
const router = express.Router();

/////////////////////noco////////////////////////
////////////////*ROUTES>JS*////////////////////
////////////////////////////////////////////

const marketRouter =require('./market');
const handlerRouter = require('./crud/handlerRouter');
const invoiceRouter = require('./invoice/invoice');
const introRouter = require('./intro/intro')
const auth = require('./auth');
const accountsRouter = require('./auth/accounts');
const registerRouter = require('./register');
const adminRouter =require('./auth/admin');
const adminPostsRouter = require('./auth/adminPosts')
router.use('/',(req,res, next)=>{next()})



router.use("/auth",auth);
router.use('/crud',handlerRouter);
router.use('/register',registerRouter);
router.use('/',adminRouter);
router.use('/',introRouter);
router.use('/',accountsRouter);
router.use('/',adminPostsRouter);
router.use('/market',marketRouter);
router.use('/',invoiceRouter);
/////////////////////




module.exports=router;