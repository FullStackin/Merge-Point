"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271312818671688/event3.png",
          preview: true,
        },
        {
          eventId: 2,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271313640751136/Group1.png",
          preview: true,
        },
        {
          eventId: 3,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271314152460288/Group2.png",
          preview: true,
        },
        {
          eventId: 4,
          url: "/",
          preview: true,
        },
        {
          eventId: 5,
          url: "/",
          preview: true,
        },
        {
          eventId: 6,
          url: "/",
          preview: true,
        },
        {
          eventId: 7,
          url: "/",
          preview: true,
        },
        {
          eventId: 8,
          url: "/",
          preview: true,
        },
        {
          eventId: 9,
          url: "/",
          preview: true,
        },
        {
          eventId: 10,
          url: "/",
          preview: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "EventImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      eventId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
