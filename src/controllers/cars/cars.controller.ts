import { Request } from 'express';
import { ICar } from '../../interfaces/entity/car.interface';
import carsService from '../../services/cars/cars.service';
import { IResponse } from '../../interfaces/response.interface';
import { ICarResponse } from '../../interfaces/api/cars/car.response.interface';
import { ApiError } from '../../helpers/apiError.helper';

class CarsController {
  async create (_: Request): Promise<IResponse<ICarResponse>> {
    const data = { ..._.body };
    const result = await carsService.create(data);

    return {
      statusCode: 201,
      data: result,
    };

  }

  async list (_: Request): Promise<IResponse<Array<ICar>>> {
    const data = { ..._.body };
    const result = await carsService.list(data);

    return {
      statusCode: 200,
      data: result,
    };
  }

  async read (_: Request): Promise<IResponse<ICar>> {
    const { id } = _.params;

    const result = await carsService.read(String(id));

    return {
      statusCode: result ? 200 : 400,
      data: result ? result : null,
    };
  }

  async update (_: Request): Promise<IResponse<String>> {
    const { id } = _.params;
    const { body } = _;

    if (!id) {
      throw new ApiError('ID not found', 400);
    }

    const data = { _id: String(id), ...body };

    const result = await carsService.update(data);

    return {
      statusCode: result ? 200 : 400,
      data: result ? result : null,
    };
  }

  async delete (_: Request): Promise<IResponse<String>> {
    const { id } = _.params;
    const result = await carsService.delete(String(id));

    return {
      statusCode: result ? 200 : 400,
      data: result ? result : null,
    };
  }
}

export default new CarsController();