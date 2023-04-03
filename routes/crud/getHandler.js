
const axios = require('axios')

    function getHandler(collections,route) {
        return async (req, res) => {
          try {
            const clientIp = req.headers['x-forwarded-for'] || req.ip;
            console.log(clientIp);  
            const data = {
              subpath: config.COLLECTION_SUBPATH,
              dbName: config.DB_NAME,
              collections
            }
       
            const response = await axios.get(config.DB_URL + '/api/readManyD', { params: data });
          //  console.log(response.data);
            res.render(route, { data: response.data,ext:data.collections  });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        };
      }  
module.exports=getHandler