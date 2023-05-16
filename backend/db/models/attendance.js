"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {}
  }
  Attendance.init(
    {
      eventId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.ENUM("pending", "waitlist", "attending"),
    },
    {
      sequelize,
      modelName: "Attendance",
    }
  );
  return Attendance;
};
