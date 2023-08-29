"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasMany(models.Event, {
        foreignKey: "venueId",
      });
      Venue.belongsTo(models.Group, {
        foreignKey: "groupId",
      });
    }
  }
  Venue.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onDelete: "set null",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isLatLong(value) {
            if (!validator.isLatLong(`${value},0`))
              throw new Error("Must be valid latitude");
          },
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isLatLong(value) {
            if (!validator.isLatLong(`0,${value}`))
              throw new Error("Must be valid longitude");
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );
  return Venue;
};
