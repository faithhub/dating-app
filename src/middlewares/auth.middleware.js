const { validationResult } = require("express-validator");

module.exports = class {
  static async validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("warning", "All fields are required");
      res.locals.message = { errors: errors.mapped() };
      return res.render("pages/auth/login");
    }
    next();
  }

  static async validateRegister(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("warning", "All fields are required");
      res.locals.message = { errors: errors.mapped() };
      return res.render("pages/auth/register");
    }
    next();
  }

  static async auth(req, res, next) {
    if (!req.session.user) {
      res.locals.message = { errors: [] };
      req.flash("warning", "Unauthurise Access");
      return res.redirect("/login");
    }
    res.locals.user = req.session.user;
    next();
  }

  static async noAuth(req, res, next) {
    if (req.session.user) {
      const user = req.session.user;
      res.locals.user = req.session.user;
      switch (user.type) {
        case "student":
          return res.redirect("/student");
        case "lecturer":
          return res.redirect("/lecturer");
        case "admin":
          return res.redirect("/admin");
          break;
        default:
          break;
      }
    }
    next();
  }
};
