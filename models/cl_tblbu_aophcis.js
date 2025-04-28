"use strict";
module.exports = (sequelize, DataTypes) => {
  const CL_tblBu_aophcis = sequelize.define(
    "CL_tblBu_aophcis",
    {
      company_code_sunfish: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true, // Since it's part of the primary key
      },
      bu_code: DataTypes.STRING(50),
      company_code_sap: DataTypes.STRING(50),
      pr_online: DataTypes.INTEGER,
      dashboard_time: DataTypes.INTEGER,
      rekimasi: DataTypes.INTEGER,
      company_short_name: DataTypes.STRING(50),
      ovt_massleave: DataTypes.STRING(50),
      shiftcode_off: DataTypes.STRING(100),
      absen_api: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "CL_tblBu_aophcis",
      timestamps: false, // No automatic createdAt/updatedAt columns
      indexes: [
        {
          unique: true,
          fields: ["company_code_sunfish"], // Primary key as unique constraint
        },
      ],
    }
  );

  return CL_tblBu_aophcis;
};
