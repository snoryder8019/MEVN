const express = require('express');
const router = express.Router();



///////////////////////
const postToHandler = require('./postToHandler');
const postToExternal = require('./postToExternal');
const getHandler = require('./getHandler');
router.use(getHandler)
router.use(postToHandler)
router.use(postToExternal)

module.exports=router
