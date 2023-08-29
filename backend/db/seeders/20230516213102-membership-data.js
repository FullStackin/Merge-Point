"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    await queryInterface.bulkInsert(
      options,
      [
        {
          userId: 1,
          groupId: 1,
          status: "pending",
        },
        {
          userId: 2,
          groupId: 2,
          status: "member",
        },
        {
          userId: 3,
          groupId: 3,
          status: "co-host",
        },
        {
          userId: 4,
          groupId: 4,
          status: "co-host",
        },
        {
          userId: 5,
          groupId: 1,
          status: "member",
        },
        {
          userId: 6,
          groupId: 2,
          status: "member",
        },
        {
          userId: 7,
          groupId: 3,
          status: "member",
        },
        {
          userId: 8,
          groupId: 4,
          status: "member",
        },
        {
          userId: 9,
          groupId: 1,
          status: "pending",
        },
        {
          userId: 10,
          groupId: 2,
          status: "co-host",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
