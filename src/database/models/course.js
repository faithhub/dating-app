"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasOne(models.User, { as: "lecturer", foreignKey: "courseId" });
      this.hasOne(models.Unicheck, { as: "unicheck", foreignKey: "courseId" });
    }
  }
  Course.init(
    {
      title: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Course",
      paranoid: true,
      timestamps: true,
    }
  );
  return Course;
};
