const express = require("express");

const { InfoController } = require("../../controllers");

const bookingRoutes = require("./booking");
const { checkLoggedIn } = require("../../middlewares/booking");

const router = express.Router();

router.get("/check", checkLoggedIn);

router.use("/bookings", bookingRoutes);

router.get("/info", InfoController.info);

module.exports = router;
