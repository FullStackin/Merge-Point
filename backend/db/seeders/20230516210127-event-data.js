"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

options.tableName = "Events";

const eventData = [
  {
    venueId: 1,
    groupId: 1,
    name: "Virtual Coding Workshop",
    description:
      "Learn to code and build web applications from the comfort of your home",
    type: "Online",
    capacity: 20,
    price: 25,
    startDate: "2023-06-02 15:00:00",
    endDate: "2023-06-02 17:00:00",
  },
  {
    venueId: 2,
    groupId: 2,
    name: "Tech Art Exhibition",
    description:
      "A showcase of digital art created using innovative technology",
    type: "In person",
    capacity: 100,
    price: 10,
    startDate: "2023-07-20 10:00:00",
    endDate: "2023-07-20 18:00:00",
  },
  {
    venueId: 3,
    groupId: 3,
    name: "Tech Conference",
    description:
      "A conference exploring the latest trends in technology and software development",
    type: "Online",
    capacity: 200,
    price: 100,
    startDate: "2023-08-10 09:00:00",
    endDate: "2023-08-10 17:00:00",
  },
  {
    venueId: 4,
    groupId: 4,
    name: "Tech Startup Showcase",
    description:
      "A gathering of tech startups showcasing their innovative products and services",
    type: "In person",
    capacity: 50,
    price: 5,
    startDate: "2023-09-05 12:00:00",
    endDate: "2023-09-05 20:00:00",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(options, eventData, {});
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        venueId: { [Op.in]: [1, 2, 3, 4] },
      },
      {}
    );
  },
};
