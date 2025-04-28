"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADATTENDANCE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADATTENDANCE.init(
    {
      attend_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true, // part of composite PK
      },
      emp_id: DataTypes.STRING,
      shiftdaily_code: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      shiftstarttime: DataTypes.STRING,
      shiftendtime: DataTypes.STRING,
      attend_code: DataTypes.STRING,
      starttime: DataTypes.STRING,
      endtime: DataTypes.STRING,
      actual_in: DataTypes.INTEGER,
      actual_out: DataTypes.INTEGER,
      daytype: DataTypes.STRING,
      ip_starttime: DataTypes.STRING,
      ip_endtime: DataTypes.STRING,
      remark: DataTypes.STRING,
      default_shift: DataTypes.STRING,
      total_ot: DataTypes.FLOAT,
      total_otindex: DataTypes.FLOAT,
      overtime_code: DataTypes.STRING,
      created_date: DataTypes.STRING,
      created_by: DataTypes.STRING,
      modified_date: DataTypes.STRING,
      modified_by: DataTypes.STRING,
      flexibleshift: DataTypes.STRING,
      auto_ovt: DataTypes.INTEGER,
      actualworkmnt: DataTypes.INTEGER,
      actual_lti: DataTypes.INTEGER,
      actual_eao: DataTypes.INTEGER,
      geolocation: DataTypes.STRING,
      geoloc_start: DataTypes.STRING,
      geoloc_end: DataTypes.STRING,
      photo_start: DataTypes.STRING,
      photo_end: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TTADATTENDANCE",
      tableName: "TTADATTENDANCE",
      timestamps: false,
    }
  );
  return TTADATTENDANCE;
};
