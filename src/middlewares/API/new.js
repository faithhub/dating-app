const multer = require("multer");
const path = require("path");
const uploadDir = "src" + "/" + "public" + "/" + "storage" + "/" + "postsnew/";
const fs = require("fs");
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/; //check extension names

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//Setting storage engine
const storageEngine = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const fileName =
      "Photo" + "_" + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

module.exports = upload;
