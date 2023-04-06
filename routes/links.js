const express = require('express');
const router = express.Router();
router.get('w2',(req,res)=>{
    res.redirect('https://w2marketing.biz')
})

module.exports = router