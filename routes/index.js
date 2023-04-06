const express = require('express');
const router = express.Router();

/////////////////////////////////////////////
////////////////*ROUTES>JS*////////////////////
////////////////////////////////////////////
const marketRouter =require('./market');
const handlerRouter = require('./crud/handlerRouter');
const invoiceRouter = require('./invoice/invoice');
const auth = require('./auth');
const accountsRouter = require('./auth/accounts');
const registerRouter = require('./register');
const linksRouter = require('./links');
const w2adminRouter = require('./auth/w2admin');
const adminRouter =require('./auth/admin');

router.use('/',(req,res, next)=>{next()})



router.use("/auth",auth);
router.use('/crud',handlerRouter);
router.use('/',registerRouter);
router.use('/',adminRouter);
router.use('/',w2adminRouter);
router.use('/',linksRouter);
router.use('/',accountsRouter);
router.use('/market',marketRouter);
router.use('/',invoiceRouter);
/////////////////////




module.exports=router;