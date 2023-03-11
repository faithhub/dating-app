"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Course, { as: "course", foreignKey: "courseId" });
      this.belongsTo(models.User, { as: "student", foreignKey: "studentId" });
      this.hasOne(models.Unicheck, { as: "unicheck", foreignKey: "fileId" });
    }
  }
  File.init(
    {
      courseId: DataTypes.STRING,
      studentId: DataTypes.STRING,
      fileTitle: DataTypes.STRING,
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "File",
      paranoid: true,
      timestamps: true,
    }
  );
  return File;
};
