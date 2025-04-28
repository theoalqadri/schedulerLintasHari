"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TTADATTOVTDETAIL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TTADATTOVTDETAIL.init(
    {
      ovtdetail_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      attend_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ot_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ot_starttime: DataTypes.STRING,
      ot_endtime: DataTypes.STRING,
      accepted_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ottype: DataTypes.STRING,
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modified_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remark: DataTypes.STRING,
      auto: DataTypes.DECIMAL(18, 0),
      before: DataTypes.DECIMAL(18, 0),
      break1: DataTypes.DECIMAL(18, 0),
      break2: DataTypes.DECIMAL(18, 0),
      break3: DataTypes.DECIMAL(18, 0),
      break4: DataTypes.DECIMAL(18, 0),
      break5: DataTypes.DECIMAL(18, 0),
      after: DataTypes.DECIMAL(18, 0),
      deducted: DataTypes.INTEGER,
      ovttype: DataTypes.STRING,
      ovtrequest_no: DataTypes.STRING,
      deductbreaktime: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TTADATTOVTDETAIL",
      tableName: "TTADATTOVTDETAIL",
      timestamps: false,
    }
  );

  return TTADATTOVTDETAIL;
};
