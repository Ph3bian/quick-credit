
import { Client } from 'pg';

const client = new Client({
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ||  5432,
  database: process.env.DB_DATABASE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
});

client.connect();

export default client;
