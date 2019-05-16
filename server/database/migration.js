import client from './connection';

client.query(`
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('verified', 'unverified');
    END IF;
END
$$;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status user_status DEFAULT 'unverified',
    isAdmin BOOLEAN DEFAULT false,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bvn VARCHAR(255) NOT NULL
);

`).then((res) => {
  console.log(res);

  client.end();
})
  .catch((error) => {
    console.log(error);

    client.end();
  });
