const api = require("../middlewares/API/api");
const auth = require("../middlewares/API/auth");
const userController = require("../controllers/API/user");
const express = require("express");
const router = express.Router();
const { validatePassword } = require("../validations/API/user");

router.route("/").get(auth, userController.profile);

router.route("/").patch(auth, userController.updateProfile);

router
  .route("/password")
  .patch(auth, validatePassword, userController.updatePassword);

module.exports = router;
