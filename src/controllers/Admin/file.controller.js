const { User, Course, File, Unicheck } = require("../../database/models");
const bcrypt = require("bcrypt");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const dir = "src/public/files";

module.exports = class {
  static async index(req, res) {
    try {
      var arrayWork = [];
      const works = await File.findAll({
        raw: true,
        nest: true,
        include: [
          {
            model: Course,
            as: "course",
            include: [
              {
                model: User,
                as: "lecturer",
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: User,
            as: "student",
          },
        ],
      });

      for (const work of works) {
        const unicheck = await Unicheck.findOne({
          where: { courseId: work.course.id },
          raw: true,
          nest: true,
        });
        work.course["unicheck"] = unicheck;
        var neww = {
          ...work,
        };
        arrayWork.push(neww);
      }

      res.locals.title = "All Files";
      res.locals.works = arrayWork;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.render("pages/admin/work/index");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async view(req, res) {
    try {
      const { id } = req.params;
      const work = await File.findOne({
        where: { id },
        include: [
          {
            model: Course,
            as: "course",
            include: [
              {
                model: User,
                as: "lecturer",
                attributes: ["id", "name", "username", "email"],
              },
              {
                model: Unicheck,
                as: "unicheck",
                attributes: ["id", "status", "percentage", "exportFile"],
              },
            ],
          },
          {
            model: User,
            as: "student",
          },
        ],
      });
      res.locals.title = "File";
      res.locals.work = work;
      res.locals.moment = moment;
      res.render("pages/admin/work/view");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const work = await File.findByPk(id);
      var dirname = path.resolve(dir, work.file);
      if (fs.existsSync(dirname)) {
        fs.unlinkSync(dirname);
      }
      await File.destroy({ where: { id } });
      req.flash("success", "File deleted successfully");
      return res.redirect("back");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/admin");
    }
  }
};
