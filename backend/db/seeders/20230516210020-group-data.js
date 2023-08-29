"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
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
        {
          organizerId: 5,
          name: "WebWizards: Crafting the Frontend Experience",
          about:
            "Join us in the mystical world of frontend development! Discover the secrets of crafting captivating user interfaces, implementing smooth animations, and unleashing the magic of web technologies.",
          type: "Online",
          private: false,
          city: "San Francisco",
          state: "CA",
        },
        {
          organizerId: 6,
          name: "DataMages: Unraveling Data Science Mysteries",
          about:
            "Venture into the realm of data science and analytics. Learn to wield the power of data to uncover hidden insights, make informed decisions, and solve real-world challenges.",
          type: "In person",
          private: false,
          city: "New York",
          state: "NY",
        },
        {
          organizerId: 7,
          name: "CloudConflux: Navigating Cloud Technologies",
          about:
            "Embark on a cloud journey through the ever-changing landscapes of cloud computing. Navigate the realms of AWS, Azure, and Google Cloud, and harness the potential of scalable infrastructure.",
          type: "Online",
          private: false,
          city: "Seattle",
          state: "WA",
        },
        {
          organizerId: 8,
          name: "HackHub: Exploring Ethical Hacking",
          about:
            "Delve into the world of ethical hacking and cybersecurity. Uncover vulnerabilities, learn penetration testing techniques, and join us in the mission to safeguard digital landscapes.",
          type: "In person",
          private: false,
          city: "Austin",
          state: "TX",
        },
        {
          organizerId: 9,
          name: "AI Nexus: Connecting with Artificial Intelligence",
          about:
            "Connect with fellow enthusiasts to explore the horizons of artificial intelligence. Discuss neural networks, machine learning, and AI applications that shape the future.",
          type: "Online",
          private: false,
          city: "Boston",
          state: "MA",
        },
        {
          organizerId: 10,
          name: "CodeCreatives: Fusing Code and Creativity",
          about:
            "Celebrate the fusion of code and creativity in this innovative group. Collaborate on interactive projects, experiment with generative art, and explore the symbiotic relationship between technology and aesthetics.",
          type: "In person",
          private: false,
          city: "Los Angeles",
          state: "CA",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        name: [
          "CodeCraft: Mastering the Art of Programming",
          "Python Pioneers: Exploring the Power of Python",
          "ByteTrail: Conquer Coding Challenges",
          "CtrlFit: Mastering Workout Mechanics with Technology",
          "WebWizards: Crafting the Frontend Experience",
          "DataMages: Unraveling Data Science Mysteries",
          "CloudConflux: Navigating Cloud Technologies",
          "HackHub: Exploring Ethical Hacking",
          "AI Nexus: Connecting with Artificial Intelligence",
          "CodeCreatives: Fusing Code and Creativity",
        ],
      },
      {}
    );
  },
};
