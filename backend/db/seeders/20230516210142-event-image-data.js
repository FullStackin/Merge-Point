"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "EventImages";
    const eventImagesData = [
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
        url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271315226202223/Group4.png",
        preview: true,
      },
    ];
    await queryInterface.bulkInsert("EventImages", eventImagesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    const eventIds = [1, 2, 3, 4];
    await queryInterface.bulkDelete("EventImages", {
      eventId: {
        [Op.in]: eventIds,
      },
    });
  },
};
