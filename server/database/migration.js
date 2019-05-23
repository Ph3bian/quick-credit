import client from './connection';

client.query(`
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
    CREATE TYPE user_status AS ENUM ('verified', 'unverified');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'loan_status') THEN
    CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END
$$;


CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL PRIMARY KEY ,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status user_status DEFAULT 'unverified',
    "isAdmin" BOOLEAN DEFAULT false,
    "isSuperAdmin" BOOLEAN DEFAULT false,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bvn VARCHAR(255),
    "activeLoan" BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS loans (
      id SERIAL NOT NULL PRIMARY KEY,
      userId INTEGER NOT NULL REFERENCES users (id),
      createdOn TIMESTAMP NOT NULL,
      status loan_status DEFAULT 'pending',
      repaid BOOLEAN DEFAULT false,
      tenor INTEGER NOT NULL,
      amount FLOAT(2) NOT NULL,
      paymentInstallment FLOAT(2) NOT NULL,
      balance FLOAT(2) NOT NULL,
      interest FLOAT(2) NOT NULL,
      loanType VARCHAR(255) NOT NULL,
      accountNo VARCHAR(255) NOT NULL 
  );
  CREATE TABLE IF NOT EXISTS repayments (
    id SERIAL NOT NULL PRIMARY KEY,
    "loanId" INTEGER NOT NULL REFERENCES loans (id),
    "createdOn" TIMESTAMP NOT NULL,
    amount FLOAT(2) NOT NULL
);
`).then((res) => {
  client.end();
})
  .catch((error) => {
    client.end();
  });
