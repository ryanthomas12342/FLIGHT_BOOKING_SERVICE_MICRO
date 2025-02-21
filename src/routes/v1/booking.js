const express = require("express");

const { BookingController } = require("../../controllers");
const { checkLoggedIn } = require("../../middlewares/booking");

const router = express.Router();

// /api/v1/airplanes POST
// router.post('/',
//         AirplaneMiddlewares.validateCreateRequest,
//         AirplaneController.createAirplane);

router.post("/", BookingController.creatBooking);

router.get("/getBookings", checkLoggedIn, BookingController.getBookingsByEmail);
module.exports = router;
