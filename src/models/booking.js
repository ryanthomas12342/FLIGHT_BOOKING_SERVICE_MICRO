"use strict";

const { Enums } = require("../utils/common");
const { BOOKED, INITIATED, PENDING, CANCELLED } = Enums.BOOKING_STATUS;
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      flightId: { allowNull: false, type: DataTypes.INTEGER },
      userEmail: { allowNull: false, type: DataTypes.STRING },
      status: {
        type: DataTypes.ENUM,
        values: [BOOKED, INITIATED, PENDING, CANCELLED],
        defaultValue: INITIATED,
      },
      noofSeats: { allowNull: false, type: DataTypes.INTEGER, defaultValue: 1 },
      totalCosts: { allowNull: false, type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
