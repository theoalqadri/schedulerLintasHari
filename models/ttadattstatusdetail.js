"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADATTSTATUSDETAIL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADATTSTATUSDETAIL.init(
    {
      attend_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true, // part of composite PK
      },
      emp_id: DataTypes.STRING,
      attend_date: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      attend_code: DataTypes.STRING,
      remark: DataTypes.STRING,
      created_by: DataTypes.STRING,
      created_date: DataTypes.STRING,
      modified_by: DataTypes.STRING,
      modified_date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TTADATTSTATUSDETAIL",
      tableName: "TTADATTSTATUSDETAIL",
      timestamps: false,
    }
  );
  return TTADATTSTATUSDETAIL;
};
