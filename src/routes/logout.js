const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/Auth/auth.controller");

const router = express.Router();

router.get("/", authController.logout);

module.exports = router;
