"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    await queryInterface.bulkInsert(
      options,
      [
        {
          id: 0,
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "test",
          lastName: "test",
        },
        {
          id: 1,
          email: "user1@gmail.com",
          username: "User1",
          hashedPassword: bcrypt.hashSync("password1"),
          firstName: "John",
          lastName: "Doe",
        },
        {
          id: 2,
          email: "user2@gmail.com",
          username: "User2",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "Jane",
          lastName: "Smith",
        },
        {
          id: 3,
          email: "user3@gmail.com",
          username: "User3",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "Michael",
          lastName: "Johnson",
        },
        {
          id: 4,
          email: "user4@gmail.com",
          username: "User4",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "Emily",
          lastName: "Brown",
        },
        {
          id: 5,
          email: "user5@gmail.com",
          username: "User5",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "William",
          lastName: "Davis",
        },
        {
          id: 6,
          email: "user6@gmail.com",
          username: "User6",
          hashedPassword: bcrypt.hashSync("password6"),
          firstName: "Olivia",
          lastName: "Miller",
        },
        {
          id: 7,
          email: "user7@gmail.com",
          username: "User7",
          hashedPassword: bcrypt.hashSync("password7"),
          firstName: "Sophia",
          lastName: "Wilson",
        },
        {
          id: 8,
          email: "user8@gmail.com",
          username: "User8",
          hashedPassword: bcrypt.hashSync("password8"),
          firstName: "Ethan",
          lastName: "Moore",
        },
        {
          id: 9,
          email: "user9@gmail.com",
          username: "User9",
          hashedPassword: bcrypt.hashSync("password9"),
          firstName: "Ava",
          lastName: "Johnson",
        },
        {
          id: 10,
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

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      username: [
        "Demo-lition",
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
    });
  },
};
