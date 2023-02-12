const { User, Course, File } = require("../../database/models");
const bcrypt = require("bcrypt");

module.exports = class {
  static async index(req, res) {
    try {
      const student = await User.count({ where: { type: "student" } });
      const lecturer = await User.count({ where: { type: "lecturer" } });
      const admin = await User.count({ where: { type: "admin" } });
      const course = await Course.count();
      const file = await File.count();
      const dataCount = {
        student: student,
        admin: admin,
        course: course,
        lecturer: lecturer,
        file: file,
      };
      res.locals.title = "Dashboard";
      res.locals.dataCount = dataCount;
      res.render("pages/admin/dashboard/index");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
  static async profile(req, res) {
    try {
      if (req.method == "POST") {
        const { id } = req.body;
        const payload = {
          ...req.body,
        };
        delete payload.id;
        const user = await User.update(payload, { where: { id } });

        if (!user) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("back");
        }

        const data = {
          id: req.session.user.id,
          email: payload.email,
          username: payload.username,
          name: payload.name,
          createdAt: req.session.user.createdAt,
          updatedAt: req.session.user.updatedAt,
          type: req.session.user.type,
        };
        req.session.user = data;
        req.flash("success", "Updated successfully");
        return res.redirect("/admin/profile");
      }
      res.locals.title = "My Profile";
      res.locals.message = { errors: {} };
      res.render("pages/admin/settings/profile");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async updatePassword(req, res) {
    try {
      if (req.method == "POST") {
        const { currentPassword, newPassword, oldPassword } = req.body;
        const { id } = req.session.user;
        const salt = bcrypt.genSaltSync();
        const payload = {
          password: bcrypt.hashSync(newPassword, salt),
        };
        delete payload.id;
        const user = await User.update(payload, { where: { id } });

        if (!user) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("back");
        }

        req.flash("success", "Updated successfully");
        return res.redirect("/admin/password");
      }

      res.locals.title = "Update Password";
      res.locals.message = { errors: {} };
      res.render("pages/admin/settings/password");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
