"use strict";

let options = { tableName: "Venues" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const venues = [
      {
        groupId: 1,
        address: "Balboa Park",
        city: "San Diego",
        state: "CA",
        lat: 32.734382,
        lng: -117.144123,
      },
      {
        groupId: 2,
        address: "USS Midway Museum",
        city: "San Diego",
        state: "CA",
        lat: 32.713628,
        lng: -117.175155,
      },
      {
        groupId: 3,
        address: "Petco Park",
        city: "San Diego",
        state: "CA",
        lat: 32.7076,
        lng: -117.157,
      },
      {
        groupId: 4,
        address: "Pike Place Market",
        city: "Seattle",
        state: "WA",
        lat: 47.6097,
        lng: -122.341,
      },
    ];

    await queryInterface.bulkInsert(options.tableName, venues, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options.tableName,
      {
        address: {
          [Op.in]: [
            "Balboa Park",
            "USS Midway Museum",
            "Petco Park",
            "Pike Place Market",
          ],
        },
      },
      {}
    );
  },
};
