"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { as: "user", foreignKey: "likeId" });
    }
  }
  Friend.init(
    {
      userId: DataTypes.INTEGER,
      likeId: DataTypes.INTEGER,
      isMatched: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      roomId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};
