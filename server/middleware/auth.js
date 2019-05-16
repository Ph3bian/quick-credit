import jwt from 'jsonwebtoken';
import client from '../database/connection';
import config from '../config/index';

export default async (req, res, next) => {

  const { token } = req.body || req.query || req.headers;

  try {
    const data = jwt.verify(token, config.jwtSecret);
    const user = await client.query({
      text: 'SELECT * FROM users WHERE id = $1',
      values: [data.id],
    });

    if (!user.rows) {
      throw new Error();
    }
    req.user = user.rows[0];
    next();

  } catch (e) {
    return res.status(401).json({ status: 401, error: 'Unauthenticated User' });
  }
};
