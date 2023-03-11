const { User, Image, Course, Post } = require("../../database/models");
const moment = require("moment");

module.exports = class {
  static async index(req, res) {
    try {
      const users = await User.findAll();
      res.locals.users = users;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.locals.title = "All Users";
      res.locals.message = {};
      res.render("pages/admin/users");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async create(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
        };
        const user = await Course.create(payload);

        if (!user) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("/admin/add-course");
        }

        req.flash("success", "New Course addedd successfully");
        return res.redirect("/admin/courses");
      }
      res.locals.title = "Add Course";
      res.locals.message = { errors: [] };
      return res.render("pages/admin/course/create");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await User.destroy({ where: { id } });
      req.flash("success", "User deleted successfully");
      return res.redirect("/admin/users");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async edit(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
        };
        delete payload.id;
        const course = await Course.update(payload, {
          where: { id: req.body.id },
        });
        if (!course) {
          req.flash("warning", "Something went wrong, try again!");
          return redirect("back");
        }

        req.flash("success", "Updated successfully");
        return res.redirect("/admin/courses");
      }

      const { id } = req.params;
      const course = await Course.findByPk(id);
      console.log(course);
      res.locals.course = course;
      res.locals.title = "Edit Course";
      res.locals.message = { errors: {} };
      return res.render("pages/admin/course/edit");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async view(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
        };
        delete payload.id;
        const course = await Course.update(payload, {
          where: { id: req.body.id },
        });
        if (!course) {
          req.flash("warning", "Something went wrong, try again!");
          return redirect("back");
        }

        req.flash("success", "Updated successfully");
        return res.redirect("/admin/courses");
      }

      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) {
        req.flash("warning", "User does not exist");
        return redirect("back" || "/admin/users");
      }

      if (user.interests) {
        const userInterestSrg = user.interests;
        user.interests = userInterestSrg.split(",");
      }
      const posts = await Post.findAll({
        where: { userId: id },
        include: [
          {
            model: Image,
            as: "image",
            attributes: ["url"],
          },
        ],
      });

      res.locals.sn = 1;
      res.locals.user = user;
      res.locals.posts = posts;
      res.locals.moment = moment;
      res.locals.title = user.name;
      res.locals.message = { errors: {} };
      return res.render("pages/admin/users/view");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
