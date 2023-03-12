"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // userId: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   allowNull: false,
      //   references: {
      //     model: "User",
      //     key: "id",
      //   },
      //   onDelete: "SET NULL",
      // },
      // planId: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   primaryKey: true,
      //   references: {
      //     model: "Subscription",
      //     key: "id",
      //   },
      //   onDelete: "SET NULL",
      // },
      userId: {
        type: Sequelize.INTEGER,
      },
      planId: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      trans: {
        type: Sequelize.STRING,
      },
      trxref: {
        type: Sequelize.STRING,
      },
      message: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Transactions");
  },
};
