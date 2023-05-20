"use strict";

let options = { tableName: "" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const attendances = [
      {
        eventId: 1,
        userId: 1,
        status: "waitlist",
      },
      {
        eventId: 2,
        userId: 2,
        status: "attending",
      },
      {
        eventId: 3,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 4,
        userId: 4,
        status: "attending",
      },
    ];
    options.tableName = "Attendances";

    await queryInterface.bulkInsert(options, attendances, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    options.tableName = "Attendances";

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
