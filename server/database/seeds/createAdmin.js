import bcrypt from 'bcryptjs';
import client from '../connection';

export default {
  create: ({
    firstName,
    lastName,
    address,
    email,
    password,
    bvn,
  }) => client.query({
    text: 'INSERT INTO users(firstName, lastName, address, email, password, bvn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [firstName, lastName, address, email, bcrypt.hashSync(password, 10), bvn],
  }),
};
