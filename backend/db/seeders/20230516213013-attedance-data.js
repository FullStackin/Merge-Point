"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    await queryInterface.bulkInsert(
      options,
      [
        {
          eventId: 1,
          userId: 1,
          status: "waitlist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 2,
          userId: 2,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 3,
          userId: 3,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 4,
          userId: 4,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 5,
          userId: 5,
          status: "waitlist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 6,
          userId: 6,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 7,
          userId: 7,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 8,
          userId: 8,
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 9,
          userId: 9,
          status: "attending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          eventId: 10,
          userId: 10,
          status: "waitlist",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    });
  },
};
