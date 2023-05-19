"use strict";

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

    await queryInterface.bulkInsert("Attendances", attendances, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(
      "Attendances",
      {
        eventId: {
          [Op.in]: [1, 2, 3, 4],
        },
      },
      {}
    );
  },
};
