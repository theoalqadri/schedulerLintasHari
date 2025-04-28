"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADATTOVTOTHER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADATTOVTOTHER.init(
    {
      attend_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      ot_date: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type_code: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
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
      modelName: "TTADATTOVTOTHER",
      tableName: "TTADATTOVTOTHER",
      timestamps: false,
    }
  );

  return TTADATTOVTOTHER;
};
