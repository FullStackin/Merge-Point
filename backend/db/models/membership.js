"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      Membership.belongsTo(models.User, {
        foreignKey: "userId",
      });
      Membership.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }
  Membership.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "Cascade",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
