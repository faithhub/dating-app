const api = require("../middlewares/API/api");
const { urlencoded } = require("express");
const auth = require("../middlewares/API/auth");
const postController = require("../controllers/API/post");
const express = require("express");
const router = express.Router();
const { createPost } = require("../validations/API/post");
const fs = require("fs");
// const upload = require("../middlewares/API/new");
// const uploadFile = require("../middlewares/API/upload");
const Multer = require("multer");
const path = require("path");
const __basedir = path.resolve();
const maxSize = 10 * 1024 * 1024;

const uploadDir = "src" + "/" + "public" + "/" + "storage" + "/" + "postsnew/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 *	multer setting for photo upload storage and imagename setting, also
 *	set the file details in request object
 */
let storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __basedir + "/" + uploadDir);
  },
  filename: function (req, file, cb) {
    const fileName =
      "Photo" + "_" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

let uploadFile = Multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

router.route("/").get(auth, postController.getPosts);

router.route("/all").get(auth, postController.allPosts);

router.route("/:id").get(auth, postController.getPost);

router.route("/liked/all").get(auth, postController.likedPosts);

router.route("/:id").delete(auth, postController.deletePost);

router.route("/:id/:type").get(auth, postController.likeUnlikePost);

// router.route("/").post(auth, createPost, postController.create);
router
  .route("/")
  .post(auth, createPost, uploadFile.single("image"), postController.create);
// router.route("/").post(auth, createPost, uploadFile, postController.create);
// router
//   .route("/")
//   .post(auth, createPost, upload.single("image"), postController.create);
// upload.single("image");
module.exports = router;
