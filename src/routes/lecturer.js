const express = require("express");
const controller = require("../controllers/Lecturer/lecturer.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const settingsController = require("../controllers/Lecturer/settings.controller");
const studentMiddleware = require("../middlewares/student.middleware");
const workController = require("../controllers/Lecturer/file.controller");
const validation = require("../validations/main.validation");

const router = express.Router();

router.get("/", authMiddleware.auth, controller.index);

router.get("/profile", authMiddleware.auth, settingsController.profile);

router.post(
  "/profile",
  authMiddleware.auth,
  validation("updateProfile"),
  studentMiddleware.updateProfile,
  settingsController.profile
);

router.get("/password", authMiddleware.auth, settingsController.updatePassword);

router.post(
  "/password",
  authMiddleware.auth,
  validation("updatePassword"),
  studentMiddleware.updatePassword,
  settingsController.updatePassword
);

router.get("/files", authMiddleware.auth, workController.index);

router.get("/view/file/:id", authMiddleware.auth, workController.view);

router.get("/check/file/:id", authMiddleware.auth, workController.check);
router.get("/initiate/file/:id", authMiddleware.auth, workController.initiate);

module.exports = router;
