const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/Auth/auth.controller");
const authValidation = require("../validations/auth.validation");

const router = express.Router();

router.get("/", authMiddleware.noAuth, authController.login);

router.post(
  "/",
  authMiddleware.noAuth,
  authValidation("login"),
  authMiddleware.validate,
  authController.login
);

module.exports = router;
