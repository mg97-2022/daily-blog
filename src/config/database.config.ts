import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
}));
