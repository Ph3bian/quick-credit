import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import userModel from '../database/models/user';


export default class AuthController {
  /**
 * Create user account: POST /auth/signup
 * @param {req} req express req object
 * @param {res} res express res object
 */

  static async signUp(req, res) {
    try {
      const { rows } = await userModel.create(req.body);
      const user = rows[0];
      delete user.password;
      const token = jwt.sign({ id: user.id }, config.jwtSecret);
      return res.status(201).json({
        status: 201,
        message: 'Sign up successful',
        data: { ...user, token },
      });
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return res.status(409).json({
          status: 409,
          error: 'Email has already been taken',
        });
      }
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
  * Login a user: POST /auth/signin
  * @param {req} req express req object
  * @param {res} res express res object
  */
  static async signIn(req, res) {
    const { email } = req.body;
    // try {
    const result = await userModel.findByEmail(email);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Invalid email address or password',
      });
    }
    const password = bcrypt.compareSync(req.body.password, user.password);
    if (password) {
      const token = jwt.sign({ id: user.id }, config.jwtSecret);
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      return res.status(200).json({
        status: 200,
        message: 'Login successful',
        data: {
          ...user,
          token,
        },
      });
    }
    return res.status(401).json({
      status: 401,
      error: 'Incorrect login details',
    });
  }

  /**
  * POST /users/:email/reset_password
  * @param {req} req express req object
  * @param {res} res express res object
  */
  static async resetPassword(req, res) {
    const { email } = req.params;

    const { rows } = await userModel.findByEmail(email);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: `${email} does not have an account, please create an account.`,
      });
    }
    const response = await userModel.resetPassword(email);

    const { status } = response.rows[0];

    return res.status(200).json({
      status: 200,
      message: `User password  ${status}`,
    });
  }
}
