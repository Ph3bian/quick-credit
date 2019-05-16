
import { Client } from 'pg';

const client = new Client({
  user: 'user',
  password: '',
  port: 5432,
  database: 'postgres',
  host: 'localhost',
});

client.connect();

export default client;
