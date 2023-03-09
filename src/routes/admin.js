const express = require("express");
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const adminValidation = require("../validations/main.validation");
const dashboardController = require("../controllers/Admin/dashboard.controller");
const lecturerController = require("../controllers/Admin/lecturer.controller");
const courseController = require("../controllers/Admin/course.controller");
const userController = require("../controllers/Admin/userController");
const subscriptionController = require("../controllers/Admin/subscriptionController");
const studentController = require("../controllers/Admin/student.controller");
const workController = require("../controllers/Admin/file.controller");

const router = express.Router();

router.get("/", authMiddleware.auth, dashboardController.index);

// User management
router.get("/users", authMiddleware.auth, userController.index);

// Subscription management
router.get("/subscriptions", authMiddleware.auth, subscriptionController.index);
router.get(
  "/add-subscription",
  authMiddleware.auth,
  subscriptionController.create
);

router.post(
  "/add-subscription",
  authMiddleware.auth,
  subscriptionController.create
);

router.get(
  "/edit-subscription/:id",
  authMiddleware.auth,
  subscriptionController.edit
);

router.post(
  "/edit-subscription/:id",
  authMiddleware.auth,
  subscriptionController.edit
);

router.get(
  "/delete-subscription/:id",
  authMiddleware.auth,
  subscriptionController.delete
);


router.get("/courses", authMiddleware.auth, courseController.index);

router.get("/add-course", authMiddleware.auth, courseController.create);

router.get("/delete/course/:id", authMiddleware.auth, courseController.delete);

router.post(
  "/add-course",
  authMiddleware.auth,
  adminValidation("createCourse"),
  adminMiddleware.createCourse,
  courseController.create
);

router.get("/edit/course/:id", authMiddleware.auth, courseController.edit);

router.post(
  "/edit/course",
  authMiddleware.auth,
  adminValidation("updateCourse"),
  adminMiddleware.updateCourse,
  courseController.edit
);

router.get("/lecturers", authMiddleware.auth, lecturerController.index);

router.get("/add-lecturer", authMiddleware.auth, lecturerController.create);

router.get("/edit/lecturer/:id", authMiddleware.auth, lecturerController.edit);

router.get(
  "/delete/lecturer/:id",
  authMiddleware.auth,
  lecturerController.delete
);

router.post(
  "/add-lecturer",
  authMiddleware.auth,
  adminValidation("createLecturer"),
  adminMiddleware.createLecturer,
  lecturerController.create
);

router.post(
  "/edit/lecturer",
  authMiddleware.auth,
  adminValidation("updateLecturer"),
  adminMiddleware.updateLecturer,
  lecturerController.edit
);

router.post(
  "/add-student",
  authMiddleware.auth,
  adminValidation("createStudent"),
  adminMiddleware.createStudent,
  studentController.create
);

router.get("/add-student", authMiddleware.auth, studentController.create);

router.get("/students", authMiddleware.auth, studentController.index);

router.get(
  "/delete/student/:id",
  authMiddleware.auth,
  studentController.delete
);
router.get(
  "/edit/student/:id",
  authMiddleware.auth,
  adminMiddleware.checkUser,
  studentController.edit
);

router.post(
  "/edit/student",
  authMiddleware.auth,
  adminValidation("updateStudent"),
  adminMiddleware.updateStudent,
  studentController.edit
);

router.get("/profile", authMiddleware.auth, dashboardController.profile);

router.post(
  "/profile",
  authMiddleware.auth,
  adminValidation("updateProfile"),
  adminMiddleware.updateProfile,
  dashboardController.profile
);

router.get(
  "/password",
  authMiddleware.auth,
  dashboardController.updatePassword
);

router.post(
  "/password",
  authMiddleware.auth,
  adminValidation("updatePassword"),
  adminMiddleware.updatePassword,
  dashboardController.updatePassword
);

router.get("/files", authMiddleware.auth, workController.index);

router.get("/view/file/:id", authMiddleware.auth, workController.view);
router.get("/delete/file/:id", authMiddleware.auth, workController.delete);

module.exports = router;
