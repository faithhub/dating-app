"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Plan.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.STRING,
      userType: {
        type: DataTypes.ENUM,
        values: ["Flexing", "Dating"],
      },
    },
    {
      sequelize,
      modelName: "Plan",
    }
  );
  return Plan;
};
