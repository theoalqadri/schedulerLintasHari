"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADOVTREQUESTDETAIL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADOVTREQUESTDETAIL.init(
    {
      requestno: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true,
      },
      empid: DataTypes.STRING,
      ovtdate: DataTypes.STRING,
      shiftdailycode: DataTypes.STRING,
      ovttimefrom: DataTypes.STRING,
      ovttimeto: DataTypes.STRING,
      rm_before: DataTypes.INTEGER,
      rm_after: DataTypes.INTEGER,
      rm_break1: DataTypes.INTEGER,
      rm_break2: DataTypes.INTEGER,
      rm_break3: DataTypes.INTEGER,
      rm_break4: DataTypes.INTEGER,
      rm_break5: DataTypes.INTEGER,
      created_date: DataTypes.STRING,
      created_by: DataTypes.STRING,
      modified_date: DataTypes.STRING,
      modified_by: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      remark: DataTypes.STRING,
      cancelsts: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TTADOVTREQUESTDETAIL",
      tableName: "TTADOVTREQUESTDETAIL",
      timestamps: false,
    }
  );
  return TTADOVTREQUESTDETAIL;
};
