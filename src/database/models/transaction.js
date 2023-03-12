"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { as: "user", foreignKey: "userId" });
      this.belongsTo(models.Subscription, { as: "sub", foreignKey: "planId" });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      planId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      trans: DataTypes.STRING,
      trxref: DataTypes.STRING,
      amount: DataTypes.STRING,
      message: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
