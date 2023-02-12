"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Admin",
      timestamps: true,
      hooks: {
        beforeCreate: (user) => {
          const saltRounds = 10;
          user.salt = bcrypt.genSaltSync(saltRounds);
          user.password = bcrypt.hashSync(user.password, user.salt);
        },
      },
    }
  );
  return Admin;
};
