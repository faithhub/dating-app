const { User, Course, File, Unicheck } = require("../../database/models");
const bcrypt = require("bcrypt");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const dir = "src/public/files";
const unicheckService = require("../../services/unicheck");

module.exports = class {
  static async index(req, res) {
    try {
      const { user } = req.session;
      var arrayWork = [];
      const works = await File.findAll({
        where: { courseId: user.courseId },
        raw: true,
        nest: true,
        include: [
          {
            model: Course,
            as: "course",
          },
          {
            model: User,
            as: "student",
          },
        ],
      });

      for (const work of works) {
        const unicheck = await Unicheck.findOne({
          where: { fileId: work.id },
          // where: { courseId: work.course.id },
          raw: true,
          nest: true,
        });
        work.course["unicheck"] = unicheck;
        var neww = {
          ...work,
        };
        arrayWork.push(neww);
      }

      console.log(arrayWork);
      res.locals.title = "All Files";
      res.locals.works = arrayWork;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.render("pages/lecturer/work/index");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lecturer");
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
                where: { fileId: id },
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
      res.render("pages/lecturer/work/view");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lecturer");
    }
  }

  static async check(req, res) {
    try {
      const { id } = req.params;
      const work = await File.findOne({
        where: { id },
        include: [
          {
            model: Unicheck,
            as: "unicheck",
          },
        ],
        raw: true,
        nest: true,
      });
      await unicheckService.confirmCheck(
        work.unicheck.id,
        work.unicheck.similarityId
      );
      return res.redirect("back");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lectuere");
    }
  }

  static async initiate(req, res) {
    try {
      const { id } = req.params;
      const work = await File.findOne({
        where: { id },
        include: [
          {
            model: Unicheck,
            as: "unicheck",
          },
        ],
        raw: true,
        nest: true,
      });
      await unicheckService.startCheck(
        work.unicheck.id,
        work.unicheck.unicheckId
      );
      return res.redirect("back");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/lectuere");
    }
  }
};
