const express = require('express')
const router = express.Router();

router.get ('api', (req,res)=>{
    const resultsd = 3;
   return res.send(resultsd);
})


module.exports = router