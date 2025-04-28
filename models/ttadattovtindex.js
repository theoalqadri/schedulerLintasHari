"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADATTOVTINDEX extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADATTOVTINDEX.init(
    {
      attend_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ot_date: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      otindex_code: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      otindex_factor: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      otindex_value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      ottype: {
        type: DataTypes.STRING(10), // corresponds to nchar(10)
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TTADATTOVTINDEX",
      tableName: "TTADATTOVTINDEX",
      timestamps: false,
    }
  );

  return TTADATTOVTINDEX;
};
