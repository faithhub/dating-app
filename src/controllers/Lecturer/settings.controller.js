const { User } = require("../../database/models");
const bcrypt = require("bcrypt");

module.exports = class {
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
        return res.redirect("/lecturer/profile");
      }
      res.locals.title = "My Profile";
      res.locals.message = { errors: {} };
      res.render("pages/lecturer/settings/profile");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lecturer");
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
        return res.redirect("/lecturer/password");
      }

      res.locals.title = "Update Password";
      res.locals.message = { errors: {} };
      res.render("pages/lecturer/settings/password");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lecturer");
    }
  }
};
