"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TEOMCOMPANY extends Model {
    static associate(models) {
      // Define associations if necessary
      // Example: TEOMCOMPANY.belongsTo(models.TPYMTAXCOUNTRY, { foreignKey: 'taxcountry' });
    }
  }

  TEOMCOMPANY.init(
    {
      company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      company_code: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      company_name: { type: DataTypes.STRING, allowNull: false },
      nick_name: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
      company_level: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      parent_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      status: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 1 },
      isbase: { type: DataTypes.TINYINT, allowNull: false, defaultValue: 0 },
      company_type: DataTypes.STRING,
      company_logo: DataTypes.STRING,
      company_address: DataTypes.STRING,
      company_address2: DataTypes.STRING,
      company_phone: DataTypes.STRING,
      company_fax: DataTypes.STRING,
      company_email: DataTypes.STRING,
      company_country: DataTypes.STRING,
      company_state: DataTypes.STRING,
      company_zipcode: DataTypes.STRING,
      taxfilenumber: DataTypes.STRING,
      taxlocation_code: DataTypes.STRING,
      taxcountry: DataTypes.STRING,
      currency_code: DataTypes.STRING,
      city_id: DataTypes.INTEGER,
      state_id: DataTypes.INTEGER,
      country_id: DataTypes.INTEGER,
      vision_en: { type: DataTypes.STRING, defaultValue: "" },
      vision_id: { type: DataTypes.STRING, defaultValue: "" },
      vision_my: { type: DataTypes.STRING, defaultValue: "" },
      vision_th: { type: DataTypes.STRING, defaultValue: "" },
      mission_en: { type: DataTypes.STRING, defaultValue: "" },
      mission_id: { type: DataTypes.STRING, defaultValue: "" },
      mission_my: { type: DataTypes.STRING, defaultValue: "" },
      mission_th: { type: DataTypes.STRING, defaultValue: "" },
      created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      created_by: { type: DataTypes.STRING, allowNull: false },
      modified_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      modified_by: { type: DataTypes.STRING, allowNull: false },
      taxoffice: DataTypes.STRING,
      gmt_id: DataTypes.INTEGER,
      local_name: DataTypes.STRING,
      UEN: DataTypes.STRING,
      register_no: DataTypes.STRING,
      company_cover: DataTypes.STRING,
      company_video: DataTypes.STRING,
      bu_code: { type: DataTypes.STRING, defaultValue: null },
    },
    {
      sequelize,
      modelName: "TEOMCOMPANY",
      tableName: "TEOMCOMPANY",
      timestamps: false,
    }
  );

  return TEOMCOMPANY;
};
