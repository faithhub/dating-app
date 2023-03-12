const api = require("../middlewares/API/api");
const auth = require("../middlewares/API/auth");
const userController = require("../controllers/API/user");
const postController = require("../controllers/API/post");
const express = require("express");
const router = express.Router();
const { validatePassword } = require("../validations/API/user");
const uploadFile = require("../middlewares/API/avatarUpload");

router.route("/").get(auth, userController.profile);

router.route("/matched-users").get(auth, postController.matches);

router.route("/").patch(auth, userController.updateProfile);

router
  .route("/password")
  .patch(auth, validatePassword, userController.updatePassword);

module.exports = router;
