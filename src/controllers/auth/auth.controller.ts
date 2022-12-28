import { Request } from 'express';
import authService from '../../services/auth/auth.service';
import { ApiError } from '../../helpers/apiError.helper';
import { IResponse } from '../../interfaces/response.interface';

class AuthController {

  async signIn (_: Request): Promise<IResponse<String>> {
    const { login, password } = _.body;
    if (!login || !password) {
      throw new ApiError('Bad request', 400);
    }

    const data = await authService.signIn(login, password);

    return {
      statusCode: 200,
      data,
    };
  }

  async signUp (_: Request): Promise<IResponse<String>> {
    const requiredFields: Array<string> = [
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'login',
      'password',
    ];

    const { body } = _;
    const missedFields: Array<String> = [];


    for (const field of requiredFields) {
      if (!Object.hasOwn(body, field)) {
        missedFields.push(field);
      }
    }

    if (missedFields.length) {
      throw new ApiError(`Not found required fields (${missedFields.join(', ')})`, 400);
    }

    const data = await authService.signUp({...body});

    return {
      statusCode: 201,
      data,
    };
  }

}

export default new AuthController();