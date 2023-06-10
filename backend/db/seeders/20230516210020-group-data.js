"use strict";

let options = { tableName: "Groups" };
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      options,
      [
        {
          organizerId: 1,
          name: "CodeCraft: Mastering the Art of Programming",
          about:
            "Enjoy learning computer programming from top experts with over 20 years of experience in coding for renowned software companies. This class is designed to teach you the proper techniques and discipline required to become a true coding champion.",
          type: "In person",
          private: false,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 2,
          name: "Python Pioneers: Exploring the Power of Python",
          about:
            "Embark on a transformative journey, exploring the boundless power of Python. Dive into innovative frameworks, unleash creativity, and collaborate on projects, fueling your passion for this dynamic programming language. Join our vibrant community today!",
          type: "Online",
          private: false,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 3,
          name: "ByteTrail: Conquer Coding Challenges",
          about:
            "Experience the thrill of coding in breathtaking digital landscapes. Explore challenging programming problems, conquer complex algorithms, and unleash your problem-solving skills. Our group is dedicated to promoting the exhilarating world of coding while fostering a community of passionate programmers. Join us for unforgettable coding adventures and create lasting memories in the realm of technology.",
          type: "In person",
          private: true,
          city: "San Diego",
          state: "CA",
        },
        {
          organizerId: 4,
          name: "CtrlFit: Mastering Workout Mechanics with Technology",
          about:
            "Learn optimal workout techniques, form, and injury prevention using cutting-edge fitness technology. Connect with like-minded fitness enthusiasts who leverage technology for maximum gains.",
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: {
          [Op.in]: [
            "CodeCraft: Mastering the Art of Programming",
            "Python Pioneers: Exploring the Power of Python",
            "ByteTrail: Conquer Coding Challenges",
            "CtrlFit: Mastering Workout Mechanics with Technology",
          ],
        },
      },
      {}
    );
  },
};
