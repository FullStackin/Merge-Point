"use strict";

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}
options.tableName = "Memberships";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
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
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        userId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
