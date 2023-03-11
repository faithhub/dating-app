const { validationResult } = require("express-validator");
const { User } = require("../database/models");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const multer = require("multer");
const filesize = require("filesize");
const path = require("path");
const Op = Sequelize.Op;

module.exports = class {
  static async updateProfile(req, res, next) {
    const { email, username } = req.body;
    const id = req.session.user.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", "All fields are required");
      res.locals.errors = errors.mapped();
      return res.redirect("back");
    }
    const checkemail = await User.count({
      where: { email, id: { [Op.notIn]: [id] } },
      paranoid: false,
    });
    if (checkemail > 0) {
      req.flash("error", "The email has already exist");
      return res.redirect("back");
    }
    const checkUsername = await User.count({
      where: { username, id: { [Op.notIn]: [id] } },
      paranoid: false,
    });
    if (checkUsername > 0) {
      req.flash("error", "The Student Matric has already exist");
      return res.redirect("back");
    }
    next();
  }

  static async updatePassword(req, res, next) {
    const { currentPassword } = req.body;
    const { id } = req.session.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", "All fields are required");
      res.locals.message = { errors: errors.mapped() };
      res.locals.title = "Update Password";
      return res.render("pages/student/settings/password");
    }

    const user = await User.findByPk(id);
    const getPassword = await bcrypt.compare(currentPassword, user.password);
    if (!getPassword) {
      req.flash("error", "The Current Password is not correct");
      return res.redirect("back");
    }
    next();
  }

  static async uploadWork(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var errorParams = errors.mapped();
      req.flash("error", "All fields are required");
      res.locals.title = "Upload Work";
      if (!(req.files && req.files.work)) {
        errorParams["work"] = { msg: "The work file is required" };
      }
      if (!(req.files && req.files.work)) {
        errorParams["work"] = { msg: "The work file is required" };
      }
      if (req.files && req.files.work) {
        var fileSize = filesize(req.files.work.size, { output: "exponent" });
        var fileExt = path.extname(req.files.work.name).toLowerCase();
        if (fileExt != "pdf") {
          errorParams["work"] = {
            msg: "The work file must be a PDF file",
          };
        }
        if (fileExt != "doc") {
          errorParams["work"] = {
            msg: "The work file must be a Doc file",
          };
        }
        if (fileSize > 20) {
          errorParams["work"] = {
            msg: "The work file size must not more than 20mb",
          };
        }
      }
      req.flash("errors", errorParams);
      return res.redirect("back");
    }
    next();
  }
};
