"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

options.tableName = "GroupImages";

const groupImagesData = [
  {
    groupId: 1,
    url: "/pic",
    preview: true,
  },
  {
    groupId: 2,
    url: "/pic",
    preview: false,
  },
  {
    groupId: 3,
    url: "/pic",
    preview: true,
  },
  {
    groupId: 4,
    url: "/pic",
    preview: true,
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, groupImagesData, {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
