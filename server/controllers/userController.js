import User from '../memory/user';
import Validator from '../validation/validator';

export default class UserController {
  static verifyUser(req, res) {
    Validator.verifyUser(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
      });
    }
    const { email } = req.params;
    const finder = input => input.email === email;
    const user = User.find(finder);
    if (user) {
      user.status = 'verified';
      const index = User.findIndex(finder);
      User[index] = user;
      return res.status(200).json({
        success: true,
        message: 'Great! User status updated successfully',
        data: user,
      });
    }
    return res.status(404).json({
      success: false,
      error: `User with ${email} not found, confirm email address`,
    });
  }
}
