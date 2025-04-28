"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADOVERTIMEFACTOR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADOVERTIMEFACTOR.init(
    {
      overtime_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      factor_no: DataTypes.INTEGER,
      step: DataTypes.FLOAT,
      value: DataTypes.FLOAT,
      created_date: DataTypes.STRING,
      created_by: DataTypes.STRING,
      modified_date: DataTypes.STRING,
      modified_by: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TTADOVERTIMEFACTOR",
      tableName: "TTADOVERTIMEFACTOR",
      timestamps: false,
    }
  );
  return TTADOVERTIMEFACTOR;
};
