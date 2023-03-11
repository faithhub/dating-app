const { File, Course, User, Unicheck } = require("../../database/models");
module.exports = class {
  static async index(req, res) {
    try {
      // const student = await User.count({ where: { type: "student" } });
      // const lecturer = await User.count({ where: { type: "lecturer" } });
      // const admin = await User.count({ where: { type: "admin" } });
      // const dataCount = {
      //   student: student,
      //   admin: admin,
      //   lecturer: lecturer,
      // };

      const works = await File.findAll({
        where: { studentId: 4 },
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
              {
                model: Unicheck,
                as: "unicheck",
                attributes: ["id", "status", "percentage", "exportFile"],
              },
            ],
          },
        ],
        distinct: true,
      });
      console.log(works);
      res.locals.title = "Dashboard";
      res.render("pages/student/dashboard/index");
    } catch (error) {
      console.log(error);
      // req.flash("error", error.message);
      // res.redirect("back" || "/student/profle");
    }
  }
};
