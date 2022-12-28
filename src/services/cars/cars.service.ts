import { ICar } from '../../interfaces/entity/car.interface';
import { ApiError } from '../../helpers/apiError.helper';
import { ICarResponse } from '../../interfaces/api/cars/car.response.interface';
import DbAdapter from '../../adapters/database/db.adapter';

class CarsService {
  async create (data: Omit<ICar, '_id'>): Promise<ICarResponse> {
    try {


      return DbAdapter.carCreate(data);
    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async list (data: any): Promise<Array<ICarResponse>> {
    try {
      return DbAdapter.carList(data);
    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async read (id: String): Promise<ICarResponse | null> {
    try {
      return DbAdapter.carRead(id);
    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async update (data: ICar): Promise<String | null> {
    try {
      const { _id, ...body } = data;

      return DbAdapter.carUpdate(String(_id), body);
    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async delete (_id: String): Promise<String | null> {
    try {

      return DbAdapter.carDelete(_id);

    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }
}

export default new CarsService();