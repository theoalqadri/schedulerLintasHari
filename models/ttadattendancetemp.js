"use strict";
module.exports = (sequelize, DataTypes) => {
  const TTADATTENDANCETEMP = sequelize.define(
    "TTADATTENDANCETEMP",
    {
      attenddata: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true, // part of composite PK
      },
      machine_code: DataTypes.STRING(50),
      attendanceid: DataTypes.STRING(50),
      attend_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hour: DataTypes.INTEGER,
      minute: DataTypes.INTEGER,
      second: DataTypes.INTEGER,
      day: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      status: DataTypes.STRING(1),
      machineno: DataTypes.STRING(50),
      uploadstatus: DataTypes.INTEGER,
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      created_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modified_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      modified_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // part of composite PK
      },
      remark: DataTypes.STRING(255),
      photo: DataTypes.STRING(255),
      geolocation: DataTypes.STRING(255),
      att_on: DataTypes.INTEGER,
    },
    {
      tableName: "TTADATTENDANCETEMP",
      timestamps: false, // Since you have `created_date` and `modified_date`, Sequelize won't manage createdAt/updatedAt
      indexes: [
        {
          unique: true,
          fields: ["attenddata", "company_id"], // Composite primary key
        },
      ],
    }
  );
  return TTADATTENDANCETEMP;
};
