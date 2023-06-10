"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "Demo@gmail.com",
          username: "DemoUser",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "Demo",
          lastName: "demo",
        },
        {
          email: "omar@gmail.com",
          username: "TallTechTitan",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "omar",
          lastName: "El Sahlah",
        },
        {
          email: "omar1@gmail.com",
          username: "OmarTheBull",
          hashedPassword: bcrypt.hashSync("password1"),
          firstName: "omar",
          lastName: "El Sahlah",
        },
        {
          email: "omar2@gmail.com",
          username: "omar1187",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "omar",
          lastName: "El Sahlah",
        },
        {
          email: "omar3@gmail.com",
          username: "omar321",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "omar",
          lastName: "El Sahlah",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["TallTechTitan", "OmarTheBull", "omar1187"] },
      },
      {}
    );
  },
};
