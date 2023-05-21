"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.Event, { foreignKey: "eventId" });
      Attendance.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Attendance.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "Cascade",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("attending", "pending", "waitlist"),
        allowNull: false,
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
