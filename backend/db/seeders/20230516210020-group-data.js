"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "options",
      [
        {
          organizerId: 1,
          name: "MMA Mastery: Unleash Your Inner Champion",
          about:
            "Enjoy learning Mixed Martial Arts from top MMA coaches with over 20 years of experience training UFC fighters and Bellator champions. This class is designed to teach you the proper techniques and discipline required to become a true champion.",
          type: "In person",
          private: false,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 2,
          name: "JavaScript Junction: Exploring the Power of JS",
          about:
            "Embark on a transformative journey, exploring the boundless power of JavaScript. Dive into innovative frameworks, unleash creativity, and collaborate on projects, fueling your passion for this dynamic language. Join our vibrant community today!",
          type: "Online",
          private: false,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "Trailblazers: Conquer Nature's Challenges",
          about:
            "Experience the thrill of mountain biking in breathtaking landscapes. Explore rugged trails, conquer challenging terrains, and unleash your adrenaline. Our group is dedicated to promoting the exhilarating sport of mountain biking while fostering a community of passionate riders. Join us for unforgettable adventures and create lasting memories on two wheels.",
          type: "In person",
          private: true,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 4,
          name: "ProperFit: Mastering Workout Mechanics",
          about:
            "Learn optimal workout techniques, form, and injury prevention. Connect with like-minded fitness enthusiasts for maximum gains.",
          type: "Online",
          private: false,
          city: "San Diego",
          state: "CA",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: ["MMA Mastery: Unleash Your Inner Champion", "JavaScript Junction: Exploring the Power of JS", "Trailblazers: Conquer Nature's Challenges", "ProperFit: Mastering Workout Mechanics"],
        },
      },
      {}
    );
  },
};
