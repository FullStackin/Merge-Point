"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const eventData = [
      {
        venueId: null,
        groupId: 1,
        name: "Virtual Coding Workshop",
        description:
          "Learn to code and build web applications from the comfort of your home. Join our expert instructors and get hands-on experience with real-world projects.",
        type: "Online",
        capacity: 20,
        price: 25,
        startDate: "2023-06-02 15:00:00",
        endDate: "2023-06-02 17:00:00",
      },
      {
        venueId: null,
        groupId: 2,
        name: "Tech Art Exhibition",
        description:
          "A showcase of digital art created using innovative technology. Explore the intersection of art and technology with cutting-edge installations and interactive experiences.",
        type: "In person",
        capacity: 100,
        price: 10,
        startDate: "2023-07-20 10:00:00",
        endDate: "2023-07-20 18:00:00",
      },
      {
        venueId: null,
        groupId: 3,
        name: "Tech Conference",
        description:
          "Join us for a comprehensive tech conference exploring the latest trends in technology and software development. Engage with industry experts, attend workshops, and network with fellow enthusiasts.",
        type: "Online",
        capacity: 200,
        price: 100,
        startDate: "2023-08-10 09:00:00",
        endDate: "2023-08-10 17:00:00",
      },
      {
        venueId: null,
        groupId: 4,
        name: "Tech Startup Showcase",
        description:
          "Be inspired by the innovation of tech startups at our showcase event. Discover new products, services, and technologies that are shaping the future. Network with entrepreneurs and investors.",
        type: "In person",
        capacity: 50,
        price: 5,
        startDate: "2023-09-05 12:00:00",
        endDate: "2023-09-05 20:00:00",
      },
    ];
    await queryInterface.bulkInsert("Events", eventData, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    const eventNames = [
      "Virtual Coding Workshop",
      "Tech Art Exhibition",
      "Tech Conference",
      "Tech Startup Showcase",
    ];
    await queryInterface.bulkDelete("Events", {
      name: {
        [Op.in]: eventNames,
      },
    });
  },
};
