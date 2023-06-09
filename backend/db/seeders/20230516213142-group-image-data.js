"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
        preview: false,
      },
      {
        groupId: 4,
        url: "/pic",
        preview: true,
      },
    ];

    options.tableName = "GroupImages";

    return queryInterface.bulkInsert(options, groupImagesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    options.tableName = "GroupImages";

    await queryInterface.bulkDelete(
      options,
      {
        groupId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
