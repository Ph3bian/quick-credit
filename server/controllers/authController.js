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

  static signUp(req, res) {
    userModel.create(req.body)
      .then(({ rows }) => {
        // eslint-disable-next-line no-param-reassign
        const user = rows[0];
        delete user.password;
        const token = jwt.sign({ id: user.id }, config.jwtSecret);
        return res.status(201).json({
          status: 201,
          success: true,
          message: 'Sign up successful',
          data: { ...user, token },
        });
      }).catch((error) => {
        if (error.constraint === 'users_email_key') {
          return res.status(409).json({
            status: 409,
            error: 'Email has already been taken',
          });
        }
        return res.status(500).json({
          status: 500,
          error,
        });
      });
  }


  /**
  * Login a user: POST /auth/signin
  * @param {req} req express req object
  * @param {res} res express res object
  */
  static async signIn(req, res) {
    const { email } = req.body;
    // const user = User.find(input => input.email === email);
    userModel.findByEmail(email)
      .then((result) => {
        const user = result.rows[0];
        if (!user) {
          return res.status(401).json({
            status: 401,
            success: false,
            error: 'Invalid email address or password',
          });
        }

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const token = jwt.sign({ id: user.id }, config.jwtSecret);
          // eslint-disable-next-line no-param-reassign
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
        return res.status(401).json({
          status: 401,
          error: 'Incorrect login details',
        });

        // eslint-disable-next-line no-unused-vars
      }).catch(error => res.status(500).json({
        status: 500,
        error,
      }));
  }
}
