"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      // define association here
    }
  }
  Attendance.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "cascade",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "cascade",
      },
      status: {
        type: DataTypes.ENUM("attending", "waitlist", "pending"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
