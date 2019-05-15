import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import User from '../memory/user';

export default class AuthController {
  /**
 * Create user account: POST /auth/signup
 * @param {req} req express req object
 * @param {res} res express res object
 */

  static signUp(req, res) {
    const user = req.body;
    const isAdmin = false;
    user.password = bcrypt.hashSync(user.password, 10);

    const data = {
      id: parseInt((Math.random() * 1000000).toFixed(), 10),
      status: 'unverified',
      ...user,
      isAdmin,

    };
    User.push(data);
    const token = jwt.sign({ id: data.id }, config.jwtSecret);
    delete data.password;
    return res.status(201).json({
      status: 201,
      success: true,
      message: 'Sign up successful',
      data: {
        ...data,
        token,
      },
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
    if (user) {
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
    return res.status(404).json({
      status: 404,
      success: false,
      error: 'Invalid email address or password',
    });
  }
}
