const { User, Course, Admin } = require("../../database/models");

module.exports = class {
  static async login(req, res) {
    try {
      if (req.method == "POST") {
        const payload = { ...req.body, email: req.body.email };
        const { email, password } = payload;
        const user = await Admin.findOne({
          where: { email: email },
          // include: [
          //   {
          //     model: Course,
          //     as: "course",
          //   },
          // ],
        });

        if (!user) {
          req.flash("error", "No record found");
          return res.render("pages/auth/login", {
            message: {
              errors: [],
              fail: "Incorrect credentials",
            },
          });
        }

        if (!user.validPassword(password)) {
          req.flash("error", "Incorrect password");
          return res.render("pages/auth/login", {
            user: "",
            message: {
              errors: [],
              fail: "Incorrect password",
            },
          });
        }
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          // type: user.type,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        // if (userData.type == "lecturer") {
        //   userData["courseTitle"] = user.course.title;
        //   userData["courseCode"] = user.course.code;
        //   userData["courseId"] = user.courseId;
        // }
        req.session.user = userData;
        res.locals.user = req.session.user;

        return res.redirect("/admin/subscriptions");
        // switch (userData.type) {
        //   case "student":
        //     return res.redirect("/student");
        //   case "lecturer":
        //     return res.redirect("/lecturer");
        //   case "admin":
        //     return res.redirect("/admin");
        //   default:
        //     break;
        // }
      }
      res.locals.message = { errors: [] };
      res.render("pages/auth/login");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/login");
    }
  }

  static async register(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
          username: req.body.matric,
          type: "student",
        };
        delete payload.matric;
        delete payload.confirmPassword;
        console.log(payload);
        const save = await User.create(payload);
        if (!save) {
          req.flash("warning", "Something went wrong, try again!");
          return res.redirect("back");
        }
        req.flash("success", "Register Successfully");
        return res.redirect("/login");
      }
      res.locals.message = { errors: [] };
      res.render("pages/auth/register");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/register");
    }
  }

  static async logout(req, res) {
    try {
      req.flash("success", "You're logged out");
      req.session.destroy(function () {});
      res.locals.user = {};
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/login");
    }
  }
};
