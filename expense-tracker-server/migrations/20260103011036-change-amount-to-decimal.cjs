"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Transactions", "amount", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
