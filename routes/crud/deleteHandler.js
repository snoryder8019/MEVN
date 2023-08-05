const axios = require('axios')
function deleteHandler(ext, route) {
  return async (req, res) => {
      const {options} = req.url.split('/')[2]
  
      const postData = {dbName: config.DB_NAME,subpath: config.COLLECTION_SUBPATH,ext, options};
      try {
        const response = await axios.post(config.DB_URL + '/publish/DeleteOneF', postData);
 
      } catch (error) {
        console.error(error);
      }
      res.redirect(route);
    };
  }
module.exports=deleteHandler