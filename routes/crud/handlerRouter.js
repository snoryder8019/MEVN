const express = require('express');
const router = express.Router();



///////////////////////
const postToHandler = require('./postToHandler');
const getHandler = require('./getHandler');
router.use(getHandler)
router.use(postToHandler)

module.exports=router
