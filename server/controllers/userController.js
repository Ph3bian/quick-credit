import userModel from '../database/models/user';
import sendMail from '../mailer/mailer';

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
    res.status(200).json({
      status: 200,
      message: `User status ${status}`,
    });
    return sendMail({
      to: user.email,
      subject: 'User Status Update',
      html: `Hello ${user.firstname}, 
      <br>Status ${status}.<br>
      Thank you for choosing Quick credit
      `,
    }).then(() => {}).catch((error) => {
      res.status(500).json({
        status: 500,
        data: error.message,
      });
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

  /**
  *View all users: PATCH/users/admin
* @param {req} req express req object
* @param {res} res express res object
*/
  static async userIsAdmin(req, res) {
    const { email } = req.params;
    const { rows } = await userModel.findByEmail(email);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'User does not exist',
      });
    }
    const response = await userModel.updateAdminStatus(email);
    const isAdmin = response.rows[0];
    return res.status(200).json({
      status: 200,
      data: isAdmin,
    });
  }
}
