"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Venues";
    await queryInterface.bulkInsert(
      options,
      [
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
        {
          groupId: 5,
          address: "TechConference Center",
          city: "San Francisco",
          state: "CA",
          lat: 37.7749,
          lng: -122.4194,
        },
        {
          groupId: 6,
          address: "DataScience Hub",
          city: "New York",
          state: "NY",
          lat: 40.7128,
          lng: -74.006,
        },
        {
          groupId: 7,
          address: "CloudTech Plaza",
          city: "Seattle",
          state: "WA",
          lat: 47.6062,
          lng: -122.3321,
        },
        {
          groupId: 8,
          address: "CyberSec Academy",
          city: "Austin",
          state: "TX",
          lat: 30.2672,
          lng: -97.7431,
        },
        {
          groupId: 9,
          address: "AI Innovation Center",
          city: "Boston",
          state: "MA",
          lat: 42.3601,
          lng: -71.0589,
        },
        {
          groupId: 10,
          address: "CodeArt Studio",
          city: "Los Angeles",
          state: "CA",
          lat: 34.0522,
          lng: -118.2437,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Venues";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
