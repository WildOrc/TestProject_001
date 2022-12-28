import express, { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import config from './config';

import { AuthRouter } from './routes/api/auth';
import { CarRouter } from './routes/api/cars';
import { IUser } from './interfaces/entity/user.interface';
import { ApiError } from './helpers/apiError.helper';
import authService from './services/auth/auth.service'
import { ConnectOptions } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | undefined;
    }

    interface Response {
    }
  }
}

export class App {
  private expressApp: express.Express;

  public constructor () {
    this.expressApp = express();
  }

  public static async init (): Promise<App> {
    const app = new App();

    await app.connectToDb();
    await app.initMiddlewares();

    app.initializeRoutes();
    app.initializeErrorHandler();

    return app;
  }

  public async start () {
    const { PORT, SERVER_URL } = config.app;
    try {

      await this.listen(SERVER_URL, PORT);
      console.log(`Application successfully started on ${ SERVER_URL }:${ PORT }`);

    } catch (e) {
      console.error(e);
    }
  }

  private async connectToDb (): Promise<void> {
    const { DATABASE_URL } = config.db;

    try {
      mongoose.set('strictQuery', true);

      await mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
      console.log('Connected to database');
    } catch (e) {
      console.error(`err: ${ e }`);
    }
  }

  private async listen (host: string, port: number): Promise<void> {
    return new Promise<void>((resolve) =>
      this.expressApp.listen(port, host, resolve),
    );
  }

  private async initMiddlewares (): Promise<void> {
    const app = this.expressApp;

    app.use(
      async (request: Request, response: Response, next: NextFunction) => {
        if (request.headers.authorization) {
          const token = request.headers.authorization.substring(
            'Bearer '.length,
          );

          try {
            const userWithAccess = await authService.validationAccessToken(token);

            if (userWithAccess) {
              request.user = userWithAccess;
              next();
              return;
            }
            throw new Error();
          } catch (e) {
            console.error(e);

            next(new ApiError('Invalid token', 401));
          }
        }
        next();
      },
    );
    app.use(express.json());
  }

  private initializeRoutes () {
    const app = this.expressApp;

    app.get('/healthcheck', (_, res) => res.json('OK'));
    app.use('/v1/auth', new AuthRouter().getRouter());
    app.use('/v1/cars', new CarRouter().getRouter());

    app.use('/', () => {
      throw new ApiError('Not Found', 404);
    });
  }

  private initializeErrorHandler () {
    this.expressApp.use(this.handleError);
  }

  private handleError (
    err: ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) {
    console.log(err);

    const statusCode = err?.status ?? 500;

    return res.status(statusCode).json({
      error: err?.message,
      data: null,
    });
  }
}
