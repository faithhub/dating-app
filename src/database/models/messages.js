"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Messages.init(
    {
      phone: DataTypes.STRING,
      text: DataTypes.STRING,
      others: {
        type: DataTypes.TEXT,
        get: function () {
          return JSON.parse(this.getDataValue("others"));
        },
        set: function (value) {
          return this.setDataValue("others", JSON.stringify(value));
        },
      },
    },
    {
      sequelize,
      modelName: "Messages",
      paranoid: true,
      timestamps: true,
    }
  );
  return Messages;
};
