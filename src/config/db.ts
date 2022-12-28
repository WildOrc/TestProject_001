import { cleanEnv, str } from 'envalid';
export default cleanEnv(process.env, {
  DATABASE_URL: str(),
  DATABASE_NAME: str(),
  DATABASE_USER: str(),
  DATABASE_PASSWORD: str(),
});