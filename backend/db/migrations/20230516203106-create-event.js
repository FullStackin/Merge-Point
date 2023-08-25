"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Events",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        venueId: {
          allowNull: true,
          type: Sequelize.INTEGER,
          references: {
            model: "Venues"
          },
        },
        groupId: {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE", // Correct capitalization
          references: {
            model: "Groups",
          },
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT,
        },
        type: {
          type: Sequelize.ENUM("Online", "In person"),
        },
        capacity: {
          type: Sequelize.INTEGER,
        },
        price: {
          type: Sequelize.INTEGER,
        },
        startDate: {
          type: Sequelize.DATE,
        },
        endDate: {
          type: Sequelize.DATE,
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
      {
        // Use the options object directly here
        schema: process.env.NODE_ENV === "production" ? process.env.SCHEMA : null,
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Events");
  },
};
