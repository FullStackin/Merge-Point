"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {}
  }
  Membership.init(
    {
      userId: DataTypes.INTEGER,
      groupId: DataTypes.INTEGER,
      status: DataTypes.ENUM("co-host", "member", "pending"),
    },
    {
      sequelize,
      modelName: "Membership",
    }
  );
  return Membership;
};
