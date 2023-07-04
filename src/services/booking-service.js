const axios = require("axios");

const { BookingRepository } = require("../repostories");

const { ServerConfig } = require("../config");

const db = require("../models");
const { AppError } = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const serverConfig = require("../config/server-config");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError(
        "Not enough seats are available",
        StatusCodes.BAD_REQUEST
      );
    }
    const totalBillingAmount = flightData.price * data.noOfSeats;
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.create(bookingPayload, transaction);

    await axios.patch(
      `${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
      {
        seats: data.noOfSeats,
      }
    );
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    throw error;
  }
}

module.exports = {
  createBooking,
};
