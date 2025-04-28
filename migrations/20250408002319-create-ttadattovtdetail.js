'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TTADATTOVTDETAILs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ovtdetail_id: {
        type: Sequelize.STRING
      },
      attend_id: {
        type: Sequelize.STRING
      },
      ot_date: {
        type: Sequelize.DATE
      },
      ot_starttime: {
        type: Sequelize.DATE
      },
      ot_endtime: {
        type: Sequelize.DATE
      },
      accepted_min: {
        type: Sequelize.INTEGER
      },
      ottype: {
        type: Sequelize.STRING
      },
      created_by: {
        type: Sequelize.STRING
      },
      created_date: {
        type: Sequelize.DATE
      },
      modified_by: {
        type: Sequelize.STRING
      },
      modified_date: {
        type: Sequelize.DATE
      },
      remark: {
        type: Sequelize.STRING
      },
      auto: {
        type: Sequelize.DECIMAL
      },
      before: {
        type: Sequelize.DECIMAL
      },
      break1: {
        type: Sequelize.DECIMAL
      },
      break2: {
        type: Sequelize.DECIMAL
      },
      break3: {
        type: Sequelize.DECIMAL
      },
      break4: {
        type: Sequelize.DECIMAL
      },
      break5: {
        type: Sequelize.DECIMAL
      },
      after: {
        type: Sequelize.DECIMAL
      },
      deducted: {
        type: Sequelize.INTEGER
      },
      ovttype: {
        type: Sequelize.STRING
      },
      ovtrequest_no: {
        type: Sequelize.STRING
      },
      deductbreaktime: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TTADATTOVTDETAILs');
  }
};