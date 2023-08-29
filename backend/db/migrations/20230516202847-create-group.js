"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

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
          references: { model: "Users" },
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        about: {
          type: Sequelize.TEXT,
        },
        type: {
          type: Sequelize.ENUM("In Person", "Online"),
          defaultValue: "In Person",
        },
        private: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
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
  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    await queryInterface.dropTable(options);
  },
};
