const { User, Course, File, Unicheck } = require("../../database/models");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
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
        raw: true,
        nest: true,
        where: { studentId: user.id },
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
        ],
      });

      for (const work of works) {
        const unicheck = await Unicheck.findOne({
          where: { fileId: work.id },
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
      res.locals.works = arrayWork;
      res.locals.moment = moment;
      res.locals.sn = 1;
      res.locals.title = "Works";
      res.render("pages/student/works/index");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "student");
    }
  }

  static async create(req, res) {
    try {
      const { user } = req.session;
      if (req.method == "POST") {
        var fileExt = path.extname(req.files.work.name).toLowerCase();
        var fileName = `${Date.now()}` + fileExt;
        var dirname = path.resolve(dir, fileName);
        var file = req.files.work.data;
        const courseId = req.body.course;

        var bodyParams = {
          courseId: courseId,
          studentId: req.session.user.id,
          fileTitle: req.body.workTile,
          file: fileName,
        };

        var newPath = path.resolve(dir);
        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath);
        }

        const fileContent = new Buffer.from(file, "base64").toString();
        fs.writeFileSync(dirname, file);

        const work = await File.create(bodyParams);
        if (!work) {
          req.flash("error", "Something went wrong, try again!");
          return res.redirect("back");
        }

        await unicheckService.uploadFile(fileName, work.id, courseId, user.id);
        req.flash("success", "Work uploaded successfully");
        return res.redirect("/student/works");
      }

      const courses = await Course.findAll({
        where: {
          "$lecturer.id$": {
            [Op.ne]: null,
          },
        },
        include: [
          {
            model: User,
            as: "lecturer",
            attributes: ["id", "name", "email"],
          },
        ],
      });
      res.locals.courses = courses;
      res.locals.title = "Submit Work";
      res.locals.message = { errors: [] };
      return res.render("pages/student/works/create");
    } catch (error) {
      console.log(error);
      req.flash("error", error.message);
      res.redirect("back" || "student");
    }
  }

  static async delete(req, res) {
    try {
      const { user } = req.session;
      const { id } = req.params;
      const work = await File.findOne({ where: { id, studentId: user.id } });
      var dirname = path.resolve(dir, work.file);
      if (fs.existsSync(dirname)) {
        fs.unlinkSync(dirname);
      }
      await File.destroy({ where: { id, studentId: user.id } });
      req.flash("success", "File deleted successfully");
      return res.redirect("back");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/student");
    }
  }

  static async view(req, res) {
    try {
      const { id } = req.params;
      const { user } = req.session;
      const work = await File.findOne({
        where: { id, studentId: user.id },
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
      res.render("pages/student/works/view");
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("back" || "/student");
    }
  }
};
