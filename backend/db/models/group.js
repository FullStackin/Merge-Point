"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.hasMany(models.Event, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.hasMany(models.Venue);
      Group.hasMany(models.GroupImage, {
        foreignKey: "groupId",
        onDelete: "CASCADE",
        hooks: true,
      });
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
      });
      Group.belongsTo(models.User, { foreignKey: "organizerId" });
    }
  }
  Group.init(
    {
      organizerId: { type: DataTypes.INTEGER, allowNull: false },
      about: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      private: { type: DataTypes.BOOLEAN, allowNull: false },
      type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["In person", "Online"],
        defaultValue: "In person",
      },
      city: { type: DataTypes.STRING, allowNull: false },
      state: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Group",
    }
  );
  return Group;
};
