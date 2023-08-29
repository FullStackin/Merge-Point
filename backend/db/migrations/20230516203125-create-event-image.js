"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "EventImages",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        eventId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: "Events" },
          onDelete: "cascade",
        },
        url: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        preview: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
    options.tableName = "EventImages";
    await queryInterface.addIndex(options, ["eventId", "url"], {
      unique: true,
    });
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await queryInterface.dropTable(options);
    await queryInterface.removeIndex(options, ["eventId", "url"]);
  },
};
