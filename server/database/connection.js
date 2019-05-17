
import { Client } from 'pg';

const client = new Client({
  user: process.env.DB_USER || 'shoadoqdydgxoj',
  password: process.env.DB_PASSWORD || '9e565814cd0341e6f7e4c18a68595e33767ebca456a0e49198047e276d8725b0',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'deegliqd43felc',
  host: process.env.DB_HOST || 'ec2-75-101-147-226.compute-1.amazonaws.com',
  ssl: true,
});

client.connect();

export default client;
