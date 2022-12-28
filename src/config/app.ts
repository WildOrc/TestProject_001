import { cleanEnv, str, num } from 'envalid';

export default cleanEnv(process.env, {
  PORT: num({ default: 3000 }),
  ENVIRONMENT: str(),
  DATABASE_URL: str(),
  SERVER_URL: str({ default: '0.0.0.0' }),
  PAGINATION_LIMIT_DEFAULT: num({ default: 20 }),
  PAGINATION_LIMIT_MAX: num({ default: 100 }),
  JWT_SECRET: str(),
  PASSWORD_SECRET: str(),
  LIFETIME_TOKEN_BY_SEC: num()
});