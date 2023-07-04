const express = require("express");
const { InfoController } = require("../../controllers/index.js");

const router = express.Router();

const BookingRoutes = require("./booking.js");

router.get("/info", InfoController.info);

router.use("/bookings", BookingRoutes);

module.exports = router;
