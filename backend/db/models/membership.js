"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      Membership.belongsTo(models.User);
      Membership.belongsTo(models.Group);
    }
  }
  Membership.init(
    {
      groupId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["member", "pending", "host", "co-host"],
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Membership",
    }
  );
  return Membership;
};
