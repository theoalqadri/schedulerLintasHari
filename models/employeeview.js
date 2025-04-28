"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EmployeeView extends Model {
    static associate(models) {
      // Define associations if needed.
    }
  }

  EmployeeView.init(
    {
      emp_id: { type: DataTypes.INTEGER, primaryKey: true },
      first_name: DataTypes.STRING,
      middle_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      full_name: DataTypes.STRING,
      gender: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      taxno: DataTypes.STRING,
      geocoord: DataTypes.STRING,
      status: DataTypes.STRING,
      req_status: DataTypes.STRING,
      lastreqno: DataTypes.STRING,
      email: DataTypes.STRING,
      photo: DataTypes.STRING,
      phone: DataTypes.STRING,
      birthplace: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      maritalstatus: DataTypes.STRING,
      address: DataTypes.STRING,
      city_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      country_id: DataTypes.INTEGER,
      zipcode: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      emp_no: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      is_main: DataTypes.BOOLEAN,
      empcompany_status: DataTypes.STRING,
      grade_code: DataTypes.STRING,
      employ_code: DataTypes.STRING,
      cost_code: DataTypes.STRING,
      spv_parent: DataTypes.STRING,
      spv_pos: DataTypes.STRING,
      spv_path: DataTypes.STRING,
      spv_level: DataTypes.INTEGER,
      mgr_parent: DataTypes.STRING,
      mgr_pos: DataTypes.STRING,
      mgr_path: DataTypes.STRING,
      mgr_level: DataTypes.INTEGER,
      pos_parent: DataTypes.STRING,
      pos_path: DataTypes.STRING,
      pospath_level: DataTypes.INTEGER,
      position_id: DataTypes.INTEGER,
      pos_code: DataTypes.STRING,
      parent_id: DataTypes.INTEGER,
      pos_name_en: DataTypes.STRING,
      pos_name_id: DataTypes.STRING,
      pos_name_my: DataTypes.STRING,
      pos_name_th: DataTypes.STRING,
      jobstatuscode: DataTypes.STRING,
      job_status_code: DataTypes.STRING,
      pos_level: DataTypes.INTEGER,
      parent_path: DataTypes.STRING,
      pos_flag: DataTypes.STRING,
      dept_id: DataTypes.INTEGER,
      dorder: DataTypes.INTEGER,
      jobtitle_code: DataTypes.STRING,
      report_topos: DataTypes.STRING,
      clevel: DataTypes.INTEGER,
      corder: DataTypes.INTEGER,
      changeflag: DataTypes.BOOLEAN,
      report_postype: DataTypes.STRING,
      dept_code: DataTypes.STRING,
      grade_order: DataTypes.INTEGER,
      grade_category: DataTypes.STRING,
      worklocation_code: DataTypes.STRING,
      businessarea_code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "EmployeeView",
      tableName: "view_employee", // Replace with the actual view name
      timestamps: false,
    }
  );

  return EmployeeView;
};
