"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Subscription.init(
    {
      name: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      features: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Subscription",
      paranoid: true,
    }
  );
  return Subscription;
};
