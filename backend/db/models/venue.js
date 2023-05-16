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
      groupId: DataTypes.INTEGER,
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
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Venue",
    }
  );
  return Venue;
};
