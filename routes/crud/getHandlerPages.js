const axios = require('axios');


async function getHandlerPages(invCollections, collection, route) {
  return async (req, res) => {
    try {
      const page = parseInt(req.params.page) || 1;
      const limit = parseInt(req.params.limit) || 10;

      const data = {
        subpath: config.COLLECTION_SUBPATH,
        dbName: config.DB_NAME,
        collections: [collection],
        page,
        limit,
      };

      const totalCountResponse = await axios.get(config.DB_URL + '/api/countTransactionItems', { params: { collection } });
      const totalItems = totalCountResponse.data.count;
      const totalPages = Math.ceil(totalItems / limit);

      const response = await axios.get(config.DB_URL + '/api/readManyDPages', { params: data });

      res.render(route, { data: response.data, ext: data.collections, totalPages, totalItems });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = getHandlerPages;
