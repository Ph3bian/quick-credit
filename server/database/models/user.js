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
  findByEmail: email => client.query({
    text: 'SELECT * FROM users WHERE email = $1 LIMIT 1',
    values: [email],
  }),
  findById: id => client.query({
    text: 'SELECT * FROM users WHERE id = $1',
    values: [id],
  }),
  findAll: () => client.query({
    text: 'SELECT * FROM users WHERE "isAdmin"= FALSE',
  }),
  updateByEmail: email => client.query({
    text: "UPDATE  users  SET status = 'verified' WHERE email = $1 RETURNING status",
    values: [email],
  }),
  updateAdminStatus: email => client.query({
    text: 'UPDATE  users  SET "isAdmin"= TRUE WHERE email = $1',
    values: [email],
  }),
};
