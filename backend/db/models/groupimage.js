"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    static associate(models) {
      GroupImage.belongsTo(models.Group, { foreignKey: "groupId" });
    }
  }
  GroupImage.init(
    {
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "cascade",
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      preview: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GroupImage",
    }
  );
  return GroupImage;
};
