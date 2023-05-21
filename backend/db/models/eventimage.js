"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      EventImage.belongsTo(models.Event, { foreignKey: "eventId" });
    }
  }
  EventImage.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "Cascade",
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "EventImage",
    }
  );
  return EventImage;
};
