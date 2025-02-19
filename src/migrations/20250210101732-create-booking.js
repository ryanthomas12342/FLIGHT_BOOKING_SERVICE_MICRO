const { Enums } = require("../utils/common");
const { BOOKED, INITIATED, PENDING, CANCELLED } = Enums.BOOKING_STATUS;
("use strict");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      flightId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        values: [BOOKED, INITIATED, PENDING, CANCELLED],
        defaultValue: INITIATED,
        type: Sequelize.ENUM,
      },
      noofSeats: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      totalCosts: {
        allowNull: false,

        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
