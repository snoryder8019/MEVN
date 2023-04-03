const axios = require('axios')
function postToHandler(ext, options, route) {
    return async (req, res) => {
      const postData = {dbName: config.DB_NAME,subpath: config.COLLECTION_SUBPATH,ext, options};
      try {
        const response = await axios.post(config.DB_URL + '/publish/postToDb', postData);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
      res.redirect(route);
    };
  }
module.exports=postToHandler