const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models");

const CrudRepository = require("../repostories/crud-repository");
const { AppError } = require("../utils/errors/app-error");
const { Enums } = require("../utils/common");

const { BOOKED, INITIATED, PENDING, CANCELLED } = Enums.BOOKING_STATUS;
class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const responce = await Booking.create(data, { transaction: transaction });
    return responce;
  }

  async get(data, transaction) {
    const responce = await Booking.findByPk(data, {
      transaction: transaction,
    });
    if (!responce) {
      throw new AppError(
        "Not able to find the resource!",
        StatusCodes.NOT_FOUND
      );
    }
    return responce;
  }

  async update(id, data, transaction) {
    const responce = await Booking.update(
      data,
      {
        where: {
          id: id,
        },
      },
      transaction
    );
    return responce;
  }

  async cancelOldBookings(timestamp) {
    console.log("in repo");
    const response = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                [Op.ne]: BOOKED,
              },
            },
            {
              status: {
                [Op.ne]: CANCELLED,
              },
            },
          ],
        },
      }
    );
    return response;
  }
}

module.exports = BookingRepository;
