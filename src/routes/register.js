const express = require("express");
const authController = require("../controllers/Auth/auth.controller");
const authValidation = require("../validations/auth.validation");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware.noAuth, authController.register);

router.post(
  "/",
  authMiddleware.noAuth,
  authValidation("register"),
  authMiddleware.validateRegister,
  authController.register
);

module.exports = router;
