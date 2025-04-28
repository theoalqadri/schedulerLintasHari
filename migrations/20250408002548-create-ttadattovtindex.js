'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TTADATTOVTINDices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      attend_id: {
        type: Sequelize.STRING
      },
      ot_date: {
        type: Sequelize.DATE
      },
      otindex_code: {
        type: Sequelize.STRING
      },
      otindex_factor: {
        type: Sequelize.FLOAT
      },
      otindex_value: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('TTADATTOVTINDices');
  }
};