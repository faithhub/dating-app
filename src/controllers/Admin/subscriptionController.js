const { User, Course, Subscription } = require("../../database/models");
const moment = require("moment");

module.exports = class {
  static async index(req, res) {
    try {
      const arrSub = [];
      const subs = await Subscription.findAll({ raw: true });

      subs.forEach((element) => {
        const str = element.features;
        const arr = str.split(",").filter((element) => element !== "");
        element.features = arr;
        arrSub.push(element);
      });

      // console.log(arrSub);
      res.locals.subs = arrSub;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.locals.title = "Subscriptions";
      res.locals.message = {};
      res.render("pages/admin/subscriptions");
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
        if (payload.features) {
          const features = payload.features;
          payload.features = features.toString();
        }

        console.log(payload);
        const subscription = await Subscription.create(payload);

        if (!subscription) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("/admin/subscriptions");
        }

        // const str = payload.features;
        // const arr = str.split(",").filter((element) => element !== "");
        // console.log(arr, features.toString());
        req.flash("success", "New Subscription created successfully");
        // return;
        return res.redirect("/admin/subscriptions");
      }
      res.locals.title = "Add Subscriptions";
      res.locals.message = { errors: [] };
      return res.render("pages/admin/subscriptions/create");
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

  static async edit(req, res) {
    try {
      if (req.method == "POST") {
        const payload = {
          ...req.body,
        };
        delete payload.id;
        const sub = await Subscription.update(payload, {
          where: { id: req.body.id },
        });
        if (!sub) {
          req.flash("warning", "Something went wrong, try again!");
          return redirect("back");
        }

        req.flash("success", "Updated successfully");
        return res.redirect("/admin/subscriptions");
      }

      const { id } = req.params;
      const sub = await Subscription.findByPk(id);
      // console.log(sub);
      res.locals.sub = sub;
      res.locals.title = "Edit Subscription";
      res.locals.message = { errors: {} };
      return res.render("pages/admin/subscriptions/edit");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
