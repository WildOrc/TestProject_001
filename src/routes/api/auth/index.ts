import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import authController from '../../../controllers/auth/auth.controller'

export class AuthRouter {
  private readonly router: Router;

  constructor() {
    this.router = Router();

    this.initRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initRoutes() {
    this.router.post(
      '/login',
      asyncHandler(this.signInHandler)
    );

    this.router.post(
      '/registration',
      asyncHandler(this.signUpHandler)
    );
  }
  private async signInHandler(_: Request, response: Response) {
    const { data, statusCode } = await authController.signIn(_);

    response.status(statusCode).json(data);
  }
  private async signUpHandler(_: Request, response: Response) {
    const { data, statusCode } = await authController.signUp(_);

    response.status(statusCode).json(data);
  }
}
