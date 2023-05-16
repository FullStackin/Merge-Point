"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId",
      });

      Event.belongsTo(models.Venue, {
        foreignKey: "venueId",
      });

      Event.hasMany(models.EventImage, {
        foreignKey: "eventId",
      });

      Event.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }
  Event.init(
    {
      venueId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        validate: {
          len: [5, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: DataTypes.ENUM("Online", "In person"),
      capacity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      startDate: {
        type: DataTypes.DATE,
        validate: {
          future(value) {
            const currentDate = new Date();
            const theirDate = new Date(value);
            if (currentDate > theirDate) {
              throw new Error("Start date must be in the future");
            }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        validate: {
          farther(value) {
            if (this.startDate > value) {
              throw new Error("End date is less than start date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
