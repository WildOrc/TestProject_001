import { IUser } from 'src/interfaces/entity/user.interface';
import { UserModel } from '../../models/user.model';
import { CarModel } from '../../models/car.model';
import { ICar } from '../../interfaces/entity/car.interface';
import { ApiError } from '../../helpers/apiError.helper';
import { getDatestamp } from '../../helpers/datetime.helper';
import { ICarUpdate } from '../../interfaces/api/cars/car.update.interface';
import { ICarResponse } from '../../interfaces/api/cars/car.response.interface';
import { TokenModel } from '../../models/token.model';
import { IToken } from '../../interfaces/entity/token.interface';
import config from '../../config';

class DbAdapter {
  private JWT_SECRET = config.app.JWT_SECRET;

  async tokenCreate (details: Pick<IToken, 'accessToken' | 'refreshToken'>): Promise<void> {
    const datestamp = getDatestamp();
    const data: IToken = {
      ...details,
      createdAt: datestamp,
      updatedAt: datestamp,
    };
    const token = new TokenModel({ ...data });

    await token.validate();
    await token.save();
  }


  async userCreate (details: IUser): Promise<Omit<IUser, '_id'>> {
    const datestamp = getDatestamp();

    const data: IUser = {
      ...details,
      createdAt: datestamp,
      updatedAt: datestamp,
    };

    const user = new UserModel({ ...data });

    await user.validate();
    return user.save();
  }

  async userSearchOneById (_id: String): Promise<IUser | null> {
    return UserModel.findOne({
      _id,
      isActive: true,
    });
  }

  async userSearchOneByLogin (login: String): Promise<IUser | null> {
    return UserModel.findOne({
      login,
      isActive: true,
    });
  }

  async carCreate (details: ICar): Promise<Omit<ICar, '_id'>> {
    const datestamp = getDatestamp();
    const data: ICar = {
      ...details,
      createdAt: datestamp,
      updatedAt: datestamp,
    };

    const car = new CarModel({ ...data });

    await car.validate();
    return car.save();
  }

  async carRead (id: String): Promise<ICarResponse | null> {
    return CarModel.findById(id);
  }

  async carUpdate (_id: String, details: ICarUpdate): Promise<String | null> {
    const datestamp = getDatestamp();
    const data: ICarUpdate = {
      ...details,
      updatedAt: datestamp,
    };

    const result = await CarModel.updateOne({ _id }, { $set: data });

    const { modifiedCount, matchedCount } = result;

    if (!matchedCount) {
      throw new ApiError('Car not found', 404);
    }

    return modifiedCount ? `UPDATED` : null;
  }

  async carDelete (_id: String): Promise<String | null> {
    const datestamp = getDatestamp();
    const data = {
      deletedAt: datestamp,
    };

    const result = await this.carUpdate(_id, data);

    return result ? `DELETED` : null;
  }

  async carList (data): Promise<Array<ICarResponse>> {
    return CarModel.find(data);
  }
}

export default new DbAdapter();