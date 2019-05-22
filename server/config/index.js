require('dotenv').config();

const { JWT_SECRET } = process.env;
const { KEY } = process.env;
const { SENDGRID_API_KEY } = process.env;
const config = {
  jwtSecret: JWT_SECRET,
  salt: KEY,
  sendGridKey: SENDGRID_API_KEY,
};

export default config;
