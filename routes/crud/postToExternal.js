const axios = require('axios')
function postToExternal(colSubpath,ext, options, route) {
    return async (req, res) => {
      const postData = {dbName: config.DB_NAME,subpath: colSubpath,ext, options};
      try {
        const response = await axios.post(config.DB_URL + '/publish/postToDb', postData);
   
      } catch (error) {
        console.error(error);
      }
      res.redirect(route);
    };
  }
module.exports=postToExternal