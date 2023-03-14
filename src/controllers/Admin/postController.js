const {
  User,
  Course,
  Subscription,
  Image,
  Post,
} = require("../../database/models");
const moment = require("moment");

module.exports = class {
  static async index(req, res) {
    try {
      const posts = await Post.findAll({
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: Image,
            as: "image",
            attributes: ["url"],
          },
          {
            model: User,
            as: "user",
            attributes: [
              "name",
              "phone",
              "email",
              "dob",
              "isActive",
              "acc_status",
              "account_purpose",
              "avatar",
              "location",
              "longitude",
              "latitude",
              "distance_preference",
              "isCompleteReg",
              "plan_id",
            ],
            include: [
              {
                model: Image,
                as: "image",
              },
            ],
          },
        ],
      });
      res.locals.posts = posts;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.locals.title = "All Post";
      res.locals.message = {};
      res.render("pages/admin/post");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async view(req, res) {
    try {
      //   const { id } = req.params;
      //   await Subscription.destroy({ where: { id } });
      //   req.flash("success", "Subscription deleted successfully");
      return res.redirect("/admin/post");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Subscription.destroy({ where: { id } });
      req.flash("success", "Subscription deleted successfully");
      return res.redirect("/admin/subscriptions");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
