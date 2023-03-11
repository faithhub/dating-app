const api = require("../middlewares/API/api");
const auth = require("../controllers/API/auth");
const express = require("express");
const router = express.Router();
const {
  validateRegistration,
  validateLogin,
  validatePhone,
  validateCode,
} = require("../validations/API/auth");

router.route("/login").post(validateLogin, auth.login);

router.route("/register").post(validateRegistration, auth.register);

router.route("/sendCode").post(validatePhone, auth.sendCode);

router.route("/verifyCode").post(validatePhone, validateCode, auth.verifyCode);

module.exports = router;
