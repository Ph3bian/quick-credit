import userModel from '../database/models/user';

export default class UserController {
  /**
 *Mark a user as verified: PATCH /users/<:user-email>/verify
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static async verifyUser(req, res) {
    const { email } = req.params;
    try {
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
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
*View all users: GET/users
* @param {req} req express req object
* @param {res} res express res object
*/
  static getAllUsers(req, res) {
    userModel.findAll(req.body).then(({ rows }) => {
      const users = rows;
      return res.status(200).json({
        status: 200,
        data: users,
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: error.message,
    }));
  }
}
