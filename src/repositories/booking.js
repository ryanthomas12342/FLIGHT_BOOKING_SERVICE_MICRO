const { StatusCodes } = require("http-status-codes");
const CrudRepository = require("./crud");

const { Booking } = require("../models");
class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async getBookingsByEmail(email) {
    const resp = await Booking.findAll({
      where: {
        userEmail: email,
      },
    });

    if (!resp) {
      throw new AppError(
        "Could not find booking of user with that emailid",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return resp;
  }
}

module.exports = BookingRepository;
