require('dotenv').config();

const { JWT_SECRET } = process.env;
const { KEY } = process.env;
const config = {
  jwtSecret: JWT_SECRET,
  salt: KEY,
};

export default config;
