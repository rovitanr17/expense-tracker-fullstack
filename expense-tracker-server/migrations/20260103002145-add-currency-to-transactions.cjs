"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Transactions", "currency", {
      type: Sequelize.STRING(3),
      allowNull: false,
      defaultValue: "IDR",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Transactions", "currency");
  },
};
