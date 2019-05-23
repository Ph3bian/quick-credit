import userModel from '../database/models/user';

export default class UserController {
  /**
 *Mark a user as verified: PATCH /users/<:user-email>/verify
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static async verifyUser(req, res) {
    const { email } = req.params;

    const { rows } = await userModel.findByEmail(email);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User does not exist',
      });
    }
    const response = await userModel.updateByEmail(email);

    const { status } = response.rows[0];

    return res.status(200).json({
      status: 200,
      message: `User status ${status}`,
    });
  }

  /**
*View all users: GET/users
* @param {req} req express req object
* @param {res} res express res object
*/
  static async getAllUsers(req, res) {
    const { rows } = await userModel.findAll(req.body);
    const users = rows;
    return res.status(200).json({
      status: 200,
      data: users,
    });
  }
}
