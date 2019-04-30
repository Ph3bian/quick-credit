import bcrypt from 'bcryptjs';
import Validator from '../validation/validator';
import User from '../memory/user';

export default class AuthController {
  static signUp(req, res) {
    Validator.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
      });
    }
    const user = req.body;
    const token = 'Bearer 1234567899999888';
    const isAdmin = false;
    user.password = bcrypt.hashSync(user.password, 10);
    const data = {
      id: parseInt((Math.random() * 1000000).toFixed(), 10),
      status: 'unverified',
      user,
      token,
      isAdmin,
    };
    User.push(data);
    return res.status(201).json({
      success: true,
      message: 'Great! Sign up successful',
      data,
    });
  }

  static signIn(req, res) {
    Validator.userSignIn(req);
    const validateErrors = req.validationErrors();

    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
      });
    }
    const { email } = req.body;

    const user = User.find(input => input.data.user.email === email);

    if (user) {
      return res.status(200).json({
        success: true,
        data: {
          user,
        },
      });
    }
    return res.status(404).json({
      success: false,
      data: {
        message: `User with this email address ${email} does not exist`,
      },
    });
  }
}
