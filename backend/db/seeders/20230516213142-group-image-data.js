"use strict";
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await queryInterface.bulkInsert(
      options,
      [
        {
          groupId: 1,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271313196175461/event4.png",
          preview: true,
        },
        {
          groupId: 2,
          url: "https://cdn.discordapp.com/attachments/1072899954525356072/1089956208703721482/python_programming_language_background_4k_594d9aed-d28e-4eb5-b4ed-dd769547ad5a.png",
          preview: true,
        },
        {
          groupId: 3,
          url: "https://cdn.discordapp.com/attachments/1014157453824376835/1089941171603775518/Malkia_a_group_of_black_software_engineers_participating_in_a_c_e0a2b6f3-c625-4b77-9143-195fd2ae6e7e.png",
          preview: true,
        },
        {
          groupId: 4,
          url: "https://cdn.discordapp.com/attachments/1108279175581794324/1116271314542547034/Group3.png",
          preview: true,
        },
        {
          groupId: 5,
          url: "/",
          preview: true,
        },
        {
          groupId: 6,
          url: "/",
          preview: true,
        },
        {
          groupId: 7,
          url: "/",
          preview: true,
        },
        {
          groupId: 8,
          url: "/",
          preview: true,
        },
        {
          groupId: 9,
          url: "/",
          preview: true,
        },
        {
          groupId: 10,
          url: "/",
          preview: true,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
