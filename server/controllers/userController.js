import User from '../memory/user';

export default class UserController {
  /**
 *Mark a user as verified: PATCH /users/<:user-email>/verify
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static verifyUser(req, res) {
    const { email } = req.params;
    const finder = input => input.email === email;
    const user = User.find(finder);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: 'User does not exist',
      });
    }
    user.status = 'verified';
    const index = User.findIndex(finder);
    User[index] = user;
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'User status updated successfully',
      data: user,
    });
  }
}
