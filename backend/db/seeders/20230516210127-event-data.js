"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const eventData = [
      // Group 1 events
      {
        venueId: 1,
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
      // Group 2 events
      {
        venueId: 2,
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
      // 3 events
      {
        venueId: 3,
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
      // Group 4 events
      {
        venueId: 4,
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
      // Group 5 events
      {
        venueId: 5,
        groupId: 5,
        name: "FutureTech Conference: Emerging Technologies",
        description:
          "Explore the future of technology with a focus on emerging trends. From AI and quantum computing to blockchain and AR/VR, discover what's next in tech.",
        type: "In person",
        capacity: 150,
        price: 75,
        startDate: "2023-10-18 09:00:00",
        endDate: "2023-10-18 17:00:00",
      },
      // Group 6 events
      {
        venueId: 6,
        groupId: 6,
        name: "Data Science Workshop: Predictive Analytics",
        description:
          "Learn how to apply predictive analytics to real-world datasets. Explore machine learning algorithms and techniques for making data-driven predictions.",
        type: "Online",
        capacity: 50,
        price: 40,
        startDate: "2023-10-02 14:00:00",
        endDate: "2023-10-02 17:00:00",
      },
      // Group 7 events
      {
        venueId: 7,
        groupId: 7,
        name: "CloudTech Expo: Future of Cloud Computing",
        description:
          "Explore the latest advancements in cloud computing technologies. From serverless architecture to multi-cloud strategies, discover the future of cloud tech.",
        type: "In person",
        capacity: 150,
        price: 50,
        startDate: "2023-11-15 10:00:00",
        endDate: "2023-11-15 18:00:00",
      },
      // Group 8 events
      {
        venueId: 8,
        groupId: 8,
        name: "Cybersecurity Workshop: Threat Hunting Techniques",
        description:
          "Deepen your understanding of cybersecurity by exploring threat hunting methodologies. Learn to identify and respond to security threats proactively.",
        type: "Online",
        capacity: 30,
        price: 20,
        startDate: "2023-12-02 13:00:00",
        endDate: "2023-12-02 15:00:00",
      },
      // Group 9 events
      {
        venueId: 9,
        groupId: 9,
        name: "AI Innovators Panel: Shaping the Future of AI",
        description:
          "Engage with AI experts and innovators as they discuss the current state and future potential of artificial intelligence. Explore AI applications and breakthroughs.",
        type: "In person",
        capacity: 100,
        price: 10,
        startDate: "2023-12-10 14:00:00",
        endDate: "2023-12-10 16:00:00",
      },
      // Group 10 events
      {
        venueId: 10,
        groupId: 10,
        name: "Game Development Workshop: From Concept to Playable Game",
        description:
          "Learn the fundamentals of game development, from concept ideation to creating a playable game prototype. Discover the tools and techniques used by game developers.",
        type: "Online",
        capacity: 40,
        price: 20,
        startDate: "2024-03-25 11:00:00",
        endDate: "2024-03-25 14:00:00",
      },
    ];
    await queryInterface.bulkInsert("Events", eventData, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      groupId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    });
  },
};
