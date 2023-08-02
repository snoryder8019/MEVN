const express = require('express');
const router = express.Router();

/////////////////////////////////////////////
////////////////*ROUTES>JS*////////////////////
////////////////////////////////////////////
const marketRouter =require('./market');
const handlerRouter = require('./crud/handlerRouter');
const invoiceRouter = require('./invoice/invoice');
const dashboardRouter = require('./dashboard/dashboard');
const auth = require('./auth');
const accountsRouter = require('./auth/accounts');
const registerRouter = require('./register');
const linksRouter = require('./links');
const blogsRouter = require('./blogs/blogs');
const cliDashRouter = require('./clientDashboard');
const w2adminRouter = require('./auth/w2admin');
const adminRouter =require('./auth/admin');
const wixRouter =require('./wix/wix');
const labRouter =require('./theLab/theLab');
const dubRouter =require('./dub/dubSquaredMedia');
const transactionsRouter = require('./transactions/transactions');

router.use('/',(req,res, next)=>{next()})



router.use('/',transactionsRouter);
router.use("/auth",auth);
router.use('/crud',handlerRouter);
router.use('/',registerRouter);
router.use('/',adminRouter);
router.use('/',w2adminRouter);
router.use('/',linksRouter);
router.use('/',blogsRouter);
router.use('/',accountsRouter);
router.use('/market',marketRouter);
router.use('/',invoiceRouter);
router.use('/',dashboardRouter);
router.use('/',wixRouter);
router.use('/',labRouter);
router.use('/',dubRouter);
router.use('/',cliDashRouter);

/////////////////////




module.exports=router;