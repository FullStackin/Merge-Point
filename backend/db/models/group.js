"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Event, { foreignKey: "groupId" });
      Group.belongsTo(models.User, {
        as: "Organizer",
        foreignKey: "organizerId",
      });
      Group.belongsToMany(models.User, {
        as: "Members",
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId",
      });
      Group.hasMany(models.Venue, { foreignKey: "groupId" });
      Group.hasMany(models.GroupImage, { foreignKey: "groupId" });
    }
  }
  Group.init(
    {
      organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { len: [1, 60] },
      },
      about: {
        type: DataTypes.TEXT,
        validate: { len: [30] },
      },
      type: {
        type: DataTypes.ENUM("In Person", "Online"),
        defaultValue: "In Person",
        validate: {
          isIn: [["In Person", "Online"]],
        },
      },
      private: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
        },
      },
    },
    {
      sequelize,
      modelName: "Group",
      scopes: {
        getPreviewImage() {
          const { GroupImage } = require("../models");
          return {
            include: {
              model: GroupImage,
              attributes: ["url"],
              where: { preview: true },
              limit: 1,
              required: false,
            },
          };
        },
        filterByMembers(userIds) {
          const { User } = require("../models");
          return {
            include: [{ model: User, as: "Members", attributes: [] }],
            where: {
              [Op.or]: { organizerId: userIds, "$Members.id$": userIds },
            },
          };
        },
        filterByHosts(userIds) {
          const { User } = require("../models");
          return {
            include: [
              {
                model: User,
                as: "Members",
                attributes: [],
                where: { id: userIds },
                through: { as: "Membership" },
              },
            ],
            where: {
              [Op.or]: {
                organizerId: userIds,
                "$Members.Membership.status$": "co-host",
              },
            },
          };
        },
        filterByGroups(groupIds) {
          return { where: { id: groupIds }, required: false };
        },
        details() {
          const { GroupImage, User, Venue } = require("../models");
          return {
            include: [
              { model: GroupImage, attributes: ["id", "url", "preview"] },
              {
                model: User,
                as: "Organizer",
                attributes: ["id", "firstName", "lastName"],
              },
              {
                model: Venue,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
            ],
          };
        },
        includeAuthorization(userId) {
          const { User } = require("../models");
          return {
            attributes: ["id", "organizerId"],
            include: [
              {
                model: User,
                as: "Members",
                attributes: ["id"],
                through: {
                  attributes: ["status"],
                  where: { status: "co-host" },
                },
                required: false,
                where: { id: userId },
              },
            ],
          };
        },
        includeVenues() {
          const { Venue } = require("../models");
          return {
            include: [
              {
                model: Venue,
                attributes: { exclude: ["createdAt", "updatedAt"] },
              },
            ],
          };
        },
      },
    }
  );
  return Group;
};
