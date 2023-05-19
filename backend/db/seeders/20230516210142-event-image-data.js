"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "EventImages";

const eventImagesData = [
  {
    eventId: 1,
    url: "/image",
    preview: true,
  },
  {
    eventId: 2,
    url: "/image",
    preview: true,
  },
  {
    eventId: 3,
    url: "/image",
    preview: false,
  },
  {
    eventId: 4,
    url: "/image",
    preview: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, eventImagesData, {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        eventId: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
      {}
    );
  },
};
