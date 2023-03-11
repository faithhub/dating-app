const api = require("../middlewares/API/api");
const auth = require("../middlewares/API/auth");
const subController = require("../controllers/API/subscription");
const express = require("express");
const router = express.Router();

router.route("/").get(auth, subController.allSubs);

module.exports = router;
