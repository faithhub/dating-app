"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
  User.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      dob: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      acc_status: {
        type: DataTypes.ENUM,
        values: ["Active", "Disabled"],
      },
      gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female"],
      },
      interests: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        defaultValue: "",
      },
      account_purpose: {
        type: DataTypes.ENUM,
        values: ["Flexing", "Dating"],
      },
      avatar: DataTypes.STRING,
      location: DataTypes.STRING,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      distance_preference: DataTypes.STRING,
      plan_id: DataTypes.INTEGER,
      isCompleteReg: DataTypes.BOOLEAN,
      currentRegPage: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      hooks: {
        beforeCreate: (user) => {
          const saltRounds = 10;
          user.salt = bcrypt.genSaltSync(saltRounds);
          user.password = bcrypt.hashSync(user.password, user.salt);
        },
      },
    },
    {
      // defaultScope: {
      //   attributes: { exclude: ["password"] },
      // },
      // scopes: {
      //   withoutPassword: {
      //     attributes: {
      //       exclude: ["password"],
      //     },
      //   },
      // },
    }
  );
  return User;
};
