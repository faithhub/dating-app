const api = require("../middlewares/API/api");
const auth = require("../middlewares/API/auth");
const transController = require("../controllers/API/subscription");
const express = require("express");
const router = express.Router();
const { createTrans } = require("../validations/API/transaction");

router.route("/").get(auth, transController.transaction);

router.route("/").post(auth, createTrans, transController.saveTransaction);

module.exports = router;
