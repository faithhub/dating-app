"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dob: {
        type: Sequelize.STRING,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      acc_status: {
        type: Sequelize.ENUM,
        values: ["Active", "Disabled"],
      },
      gender: {
        type: Sequelize.ENUM,
        values: ["Male", "Female"],
      },
      interests: {
        type: Sequelize.TEXT,
      },
      account_purpose: {
        type: Sequelize.ENUM,
        values: ["Flexing", "Dating"],
      },
      avatar: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      distance_preference: {
        type: Sequelize.STRING,
      },
      plan_id: {
        type: Sequelize.INTEGER,
      },
      isCompleteReg: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      currentRegPage: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
