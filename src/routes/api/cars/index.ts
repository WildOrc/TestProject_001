import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import carController from '../../../controllers/cars/cars.controller';
import { ApiError } from '../../../helpers/apiError.helper';

export class CarRouter {
  private readonly router: Router;

  constructor () {
    this.router = Router();

    this.initRoutes();
  }

  public getRouter () {
    return this.router;
  }

  private initRoutes () {

    this.router.get(
      '/',
      asyncHandler(this.listCarsHandler),
    );

    this.router.post(
      '/',
      asyncHandler(this.createCarsHandler),
    );

    this.router.get(
      '/:id',
      asyncHandler(this.getCarsHandler),
    );

    this.router.patch(
      '/:id',
      asyncHandler(this.updateCarsHandler),
    );

    this.router.delete(
      '/:id',
      asyncHandler(this.deleteCarsHandler),
    );
  }

  private async getCarsHandler (_: Request, response: Response) {
    if (!_.user) {
      throw new ApiError('Access denied', 401);
    }

    const { data, statusCode } = await carController.read(_);

    response.status(statusCode).json({ data });
  }

  private async listCarsHandler (_: Request, response: Response) {
    if (!_.user) {
      throw new ApiError('Access denied', 401);
    }

    const { data, statusCode } = await carController.list(_);

    response.status(statusCode).json(data);
  }

  private async updateCarsHandler (_: Request, response: Response) {
    if (!_.user) {
      throw new ApiError('Access denied', 401);
    }

    const { data, statusCode } = await carController.update(_);

    response.status(statusCode).json({ data });
  }

  private async createCarsHandler (_: Request, response: Response) {
    if (!_.user) {
      throw new ApiError('Access denied', 401);
    }

    const { data, statusCode } = await carController.create(_);

    response.status(statusCode).json(data);
  }

  private async deleteCarsHandler (_: Request, response: Response) {
    if (!_.user) {
      throw new ApiError('Access denied', 401);
    }

    const { data, statusCode } = await carController.delete(_);

    response.status(statusCode).json(data);
  }
}
