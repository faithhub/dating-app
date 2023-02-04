const apis = require("../../constant/apis.json");

module.exports = async function api(req, res, next) {
  try {
    function searchApiKey(array, key) {
      var exists = false;
      var data = {};

      if (!Array.isArray(array) || !key) {
        return { exists, data };
      }
      for (i = 0; i < array.length; i++) {
        if (array[i].key == key) {
          exists = true;
          data = array[i];
        }
      }
      return { exists, data };
    }

    let api_key = req.header("x-api-key");
    let today = new Date().toISOString().split("T")[0];
    var searchResult = searchApiKey(apis, api_key);

    if (!(new Date(searchResult.data.date) > new Date(today))) {
      return res.status(500).json({ error: "Not Authorized" });
    }
    next();
  } catch (e) {
    return res.status(401).json({
      error: e.message,
      message: "Something went wrong.",
    });
  }
};
