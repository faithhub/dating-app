"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Unicheck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Unicheck.init(
    {
      fileId: DataTypes.STRING,
      courseId: DataTypes.STRING,
      studentId: DataTypes.STRING,
      unicheckId: DataTypes.STRING,
      similarityId: DataTypes.STRING,
      exportFile: DataTypes.STRING,
      percentage: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Initiate", "Checked"],
      },
    },
    {
      sequelize,
      modelName: "Unicheck",
      paranoid: true,
      timestamps: true,
    }
  );
  return Unicheck;
};
