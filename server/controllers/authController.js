import Validator from '../validation/validator';
import User from '../memory/user';

export default class AuthController {
  static signUp(req, res) {
    Validator.user(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: validateErrors[0].msg,
      });
    }
    const user = req.body;
    const token = 'Bearer 1234567899999888';
    const isAdmin = false;
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
      data,
    });
  }
}
