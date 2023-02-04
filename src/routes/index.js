const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const postRoutes = require("./post");
const adminRoutes = require("./admin");
const loginRoutes = require("./login");
const logoutRoutes = require("./logout");
const registerRoutes = require("./register");
const router = express.Router();

// router.use("/api", function (req, res, next) {
//   res.status(200).json({
//     message: "It's working now",
//   });
// });

router.use("/api/auth", authRoutes);

router.use("/api/user", userRoutes);

router.use("/api/posts", postRoutes);

router.use("/admin", adminRoutes);
router.use("/", loginRoutes);
router.use("/login", loginRoutes);
router.use("/logout", logoutRoutes);
router.use("/register", registerRoutes);
module.exports = router;
