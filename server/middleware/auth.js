import jwt from 'jsonwebtoken';
import userModel from '../database/models/user';
import config from '../config/index';

export default async (req, res, next) => {
  const token = req.header('token');
  try {
    const { id } = jwt.verify(token, config.jwtSecret);
    const { rows } = await userModel.findById(id);
    const user = rows[0];
     if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 401, error: 'Unauthenticated User' });
  }
};
