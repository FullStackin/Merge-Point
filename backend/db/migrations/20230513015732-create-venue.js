"use strict";
require("dotenv").config();

let options = {};
if (process.env.NODE_ENV === "production" && process.env.SCHEMA) {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Groups",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        organizerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        about: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        private: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        type: {
          type: Sequelize.ENUM("In person", "Online"),
          allowNull: false,
          defaultValue: "In person",
        },
        city: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        state: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface) {
    options.tableName = "Groups";
    await queryInterface.dropTable(options);
  },
};
