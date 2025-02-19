const express = require("express");

const { BookingController } = require("../../controllers");

const router = express.Router();

// /api/v1/airplanes POST
// router.post('/',
//         AirplaneMiddlewares.validateCreateRequest,
//         AirplaneController.createAirplane);

router.post("/", BookingController.creatBooking);
module.exports = router;
