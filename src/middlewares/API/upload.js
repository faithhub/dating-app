const fs = require("fs");
const util = require("util");
const Multer = require("multer");
const path = require("path");
const __basedir = path.resolve();
const maxSize = 10 * 1024 * 1024;

const uploadDir = "src" + "/" + "public" + "/" + "storage" + "/" + "posts/";

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

/**
 *	Function to set storage for single upload, named as FILENAME
 */
let uploadFile = Multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
