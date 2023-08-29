'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    static associate(models) {
      // define association here
    }
  }
  Membership.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "cascade"
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "cascade"
    },
    status: {
      type: DataTypes.ENUM('member', 'pending', 'co-host'),
      defaultValue: "pending"
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
