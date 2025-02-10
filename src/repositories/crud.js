const { Logger } = require("../config/index");
const AppError = require("../utils/errors/apperror");
const { StatusCodes } = require("http-status-codes");
class CrudRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    console.log(":this is the data");
    console.log(data);
    const response = await this.model.create(data);
    return response;

    // Logger.error("Something went wrong in the crud repo :create ");
    // throw err;
  }
  async destroy(data) {
    const response = await this.model.destroy({
      where: {
        id: data,
      },
    });
    if (!response) {
      throw new AppError(
        "Airplane could not be deleted as it doesnt exist",
        StatusCodes.NOT_FOUND
      );
    }
    return response;
  }
  async get(data) {
    const resp = await this.model.findByPk(data);
    if (!resp) {
      throw new AppError(
        "There was no airplane with this id",
        StatusCodes.NOT_FOUND
      );
    }
    console.log(resp);
    return resp;
  }
  async getAll() {
    const response = await this.model.findAll();
    return response;
  }
  async update(data, id) {
    const response = await this.model.update(data, {
      where: {
        id: id,
      },
    });
    console.log("this sis ", response);
    if (!response) {
      throw new AppError(
        "Airplane could not be updated as it doesnt exist",
        StatusCodes.NOT_FOUND
      );
    }

    return response;
  }
}

module.exports = CrudRepository;
