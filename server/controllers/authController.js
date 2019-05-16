import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import User from '../memory/user';
import client from '../database/connection';

export default class AuthController {
  /**
 * Create user account: POST /auth/signup
 * @param {req} req express req object
 * @param {res} res express res object
 */

  static signUp(req, res) {
    const {
      email, firstName, lastName, password, address, bvn,
    } = req.body;
    client.query({
      text: 'INSERT INTO users(firstName, lastName, address, email, password, bvn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [firstName, lastName, address, email, bcrypt.hashSync(password, 10), bvn],
    }).then(({ rows }) => {
      delete rows[0].password;
      return res.status(201).json({
        status: 201,
        success: true,
        message: 'Sign up successful',
        data: {
          ...rows[0],
          token: jwt.sign({
            id: rows[0].id,
          }, config.jwtSecret),
        },
      });
    }).catch((e) => {
      if (e.constraint === 'users_email_key') {
        return res.status(422).json({
          status: 422,
          error: 'Email has already been taken',
        });
      }

      return res.status(400).json({
        status: 400,
        error: e,
      });
    });
  }


  /**
  * Login a user: POST /auth/signin
  * @param {req} req express req object
  * @param {res} res express res object
  */
  static signIn(req, res) {
    const { email } = req.body;
    const user = User.find(input => input.email === email);

    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'Invalid email address or password',
      });
    }
    delete user.password;
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Login successful',
      data: {
        ...user,
        token,
      },
    });
  }
}
