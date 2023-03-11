"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLikes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserLikes.init(
    {
      userId: {
        type: DataTypes.INTEGER,
      },
      likedUsers: {
        type: DataTypes.TEXT,
        defaultValue: "0",
        allowNull: false,
      },
      likedPosts: {
        type: DataTypes.TEXT,
        defaultValue: "0",
        allowNull: false,
      },
      matchedUsers: {
        type: DataTypes.TEXT,
        defaultValue: "0",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserLikes",
    }
  );
  return UserLikes;
};
