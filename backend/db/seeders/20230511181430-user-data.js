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
          email: "user1@gmail.com",
          username: "User1",
          hashedPassword: bcrypt.hashSync("password1"),
          firstName: "John",
          lastName: "Doe",
        },
        {
          email: "user2@gmail.com",
          username: "User2",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Jane",
          lastName: "Smith",
        },
        {
          email: "user3@gmail.com",
          username: "User3",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Michael",
          lastName: "Johnson",
        },
        {
          email: "user4@gmail.com",
          username: "User4",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "Emily",
          lastName: "Brown",
        },
        {
          email: "user5@gmail.com",
          username: "User5",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "William",
          lastName: "Davis",
        },
        {
          email: "user6@gmail.com",
          username: "User6",
          hashedPassword: bcrypt.hashSync("password6"),
          firstName: "Olivia",
          lastName: "Miller",
        },
        {
          email: "user7@gmail.com",
          username: "User7",
          hashedPassword: bcrypt.hashSync("password7"),
          firstName: "Sophia",
          lastName: "Wilson",
        },
        {
          email: "user8@gmail.com",
          username: "User8",
          hashedPassword: bcrypt.hashSync("password8"),
          firstName: "Ethan",
          lastName: "Moore",
        },
        {
          email: "user9@gmail.com",
          username: "User9",
          hashedPassword: bcrypt.hashSync("password9"),
          firstName: "Ava",
          lastName: "Johnson",
        },
        {
          email: "user10@gmail.com",
          username: "User10",
          hashedPassword: bcrypt.hashSync("password10"),
          firstName: "Liam",
          lastName: "Williams",
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
        username: {
          [Op.in]: [
            "User1",
            "User2",
            "User3",
            "User4",
            "User5",
            "User6",
            "User7",
            "User8",
            "User9",
            "User10",
          ],
        },
      },
      {}
    );
  },
};
