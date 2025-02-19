const { StatusCodes } = require("http-status-codes");

const { BookingService } = require("../services");
const { SuccessMessage, ErrorMessage } = require("../utils/common");
const AppError = require("../utils/errors/app-error");

const creatBooking = async (req, res) => {
  try {
    const resp = await BookingService.createBooking(req.body);
    SuccessMessage.data = resp;

    return res.status(StatusCodes.OK).json(SuccessMessage);
  } catch (err) {
    ErrorMessage.error = new AppError(err.explanation, err.statusCode);
    console.log(err);
    return res.status(err.statusCode).json(ErrorMessage);
  }
};

module.exports = {
  creatBooking,
};
