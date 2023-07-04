const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models");

const CrudRepository = require("../repostories/crud-repository");
const { AppError } = require("../utils/errors/app-error");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const responce = await Booking.create(data, { transaction: transaction });
    return responce;
  }

  async get(data, transaction) {
    const responce = await this.model.findByPk(data, {
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
    const responce = await this.model.update(
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
}

module.exports = BookingRepository;
