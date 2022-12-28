import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import config from '../../config';
import { ApiError } from '../../helpers/apiError.helper';
import { getDatestamp } from '../../helpers/datetime.helper';
import { IPairTokens } from '../../interfaces/api/auth/pairTokens.interface';
import { ISignUp } from '../../interfaces/api/auth/signUp.interface';
import { IUser } from '../../interfaces/entity/user.interface';
import DbAdapter from '../../adapters/database/db.adapter';
import { IToken } from '../../interfaces/entity/token.interface';
import { TokenModel } from '../../models/token.model';

export * as config from './../../config';

class AuthService {
  private LIFETIME_TOKEN_BY_SEC = config.app.LIFETIME_TOKEN_BY_SEC;
  private PASSWORD_SECRET = config.app.PASSWORD_SECRET;
  private JWT_SECRET = config.app.JWT_SECRET;

  async signIn (login: String, passcode: String): Promise<String> {
    try {
      const user = await DbAdapter.userSearchOneByLogin(login);

      if (!user) {
        throw new ApiError('User not found', 401);
      }
      const { _id, password } = user;

      const isAccessAvailable = this.checkPassword(passcode, password);

      if (!isAccessAvailable) {
        throw new ApiError('Error credentials', 400);
      }

      const { accessToken } = await this.createTokens({ _id });
      return accessToken;

    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async signUp (data: ISignUp): Promise<String> {
    try {
      const { password, ...userData } = data;

      const newUserData: IUser = {
        password: await this.encryptPassword(String(password)),
        ...userData,
      };

      await DbAdapter.userCreate({ ...newUserData });

      return `Registration completed successfully`;
    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }

  async createTokens (data: Partial<IToken>): Promise<IPairTokens> {
    try {
      let payload = { ...data };
      const accessToken = await this.jwtSign(payload);

      payload = { ...data, accessToken };
      const refreshToken = await this.jwtSign(payload);


      const parcel: Pick<IToken, 'accessToken' | 'refreshToken'> = {
        accessToken,
        refreshToken,
      };
      await DbAdapter.tokenCreate(parcel);

      return {
        accessToken,
        refreshToken,
      };

    } catch (e: any) {
      const message = e?.message || 'Internal error';
      const status = e?.status || 500;

      throw new ApiError(message, status);
    }
  }

  async jwtSign (data): Promise<String> {
    const payload = {
      exp: getDatestamp() + this.LIFETIME_TOKEN_BY_SEC,
      ...data,
    };
    return jwt.sign({ ...payload }, this.JWT_SECRET);
  }

  checkPassword (passcode: String, password: String): Boolean {
    return password === this.encryptPassword(passcode);
  }

  encryptPassword (password: String): String {
    return crypto
      .createHmac('sha1', this.PASSWORD_SECRET)
      .update(password.toString())
      .digest('hex');
  }

  async validationAccessToken (token: String): Promise<IUser | null> {
    try {
      await jwt.verify(token, this.JWT_SECRET);

      const dbToken = await TokenModel.findOne({
        accessToken: token,
        isRevoked: false,
      });

      if (!dbToken) {
        throw new ApiError(`Token isn't valid`, 401);
      }

      const payload = jwt.decode(token);

      if (payload) {
        const { _id } = payload;
        return  DbAdapter.userSearchOneById(_id);
      }
      return null;

    } catch (e: any) {
      const message = e?.message || 'DB error';
      const status = e?.status || 503;

      throw new ApiError(message, status);
    }
  }
}

export default new AuthService();