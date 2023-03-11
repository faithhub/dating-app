const api = require("../middlewares/API/api");
const { urlencoded } = require("express");
const auth = require("../middlewares/API/auth");
const postController = require("../controllers/API/post");
const express = require("express");
const router = express.Router();
const { createPost } = require("../validations/API/post");
const multer = require("multer");
const upload = require("../middlewares/API/new");
const uploadFile = require("../middlewares/API/upload");

router.route("/").get(auth, postController.getPosts);

router.route("/all").get(auth, postController.allPosts);

router.route("/:id").get(auth, postController.getPost);

router.route("/liked/all").get(auth, postController.likedPosts);

router.route("/:id").delete(auth, postController.deletePost);

router.route("/:id/:type").get(auth, postController.likeUnlikePost);

// router.route("/").post(auth, createPost, postController.create);
// router.route("/").post(auth, createPost, uploadFile, postController.create);
router
  .route("/")
  .post(auth, createPost, upload.single("image"), postController.create);
// upload.single("image");
module.exports = router;
