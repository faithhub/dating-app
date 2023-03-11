const { User } = require("../../database/models");
const moment = require("moment");

module.exports = class {
  static async index(req, res) {
    try {
      const students = await User.findAll({
        where: { type: "student" },
        order: [["id", "DESC"]],
      });
      res.locals.students = students;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.locals.title = "Students";
      res.locals.message = {};
      res.render("pages/admin/student");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async create(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
          username: req.body.userId,
          type: "student",
        };
        delete payload.userId;
        const user = await User.create(payload);

        if (!user) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("/admin/add-student");
        }

        req.flash("success", "New record addedd successfully");
        return res.redirect("/admin/students");
      }

      res.locals.title = "Add Student";
      res.locals.message = { errors: [] };
      return res.render("pages/admin/student/create");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      req.flash("success", "Student deleted successfully");
      return res.redirect("admin/students");
    } catch (error) {
      console.log(error);
      // req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async edit(req, res) {
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

        req.flash("success", "Update successfully");
        return res.redirect("/admin/students");
      }

      const { id } = req.params;
      res.locals.student = await User.findByPk(id);
      res.locals.title = "Edit Student";
      return res.render("pages/admin/student/edit");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
