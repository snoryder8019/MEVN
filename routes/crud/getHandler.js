const axios = require('axios');

function getHandler(collections, route) {
  return async (req, res) => {
    try {
      const sortParam = req.query.sort || 'defaultSortParam';
      
      const data = {
        subpath: config.COLLECTION_SUBPATH,
        dbName: config.DB_NAME,
        collections
      };
      
      const response = await axios.get(config.DB_URL + '/api/readManyD', { params: data });
      
      // Check if the data exists and is an array
      if (Array.isArray(response.data[4])) {
        // Sort data based on sortParam
        const sortedData = response.data[4].sort((a, b) => a[sortParam] - b[sortParam]);
        response.data[4] = sortedData;
      }
      
      res.render(route, { data: response.data, ext: data.collections });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = getHandler;
