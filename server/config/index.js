require('dotenv').config();

const { JWT_SECRET } = process.env;
const { KEY } = process.env;
const { SENDGRID_API_KEY } = process.env;
const { ADMIN_FIRSTNAME } = process.env;
const { ADMIN_LASTNAME } = process.env;
const { ADMIN_ADDRESS } = process.env;
const { ADMIN_EMAIL } = process.env;
const { ADMIN_PASSWORD } = process.env;
const { ADMIN_BVN } = process.env;

const config = {
  jwtSecret: JWT_SECRET,
  salt: KEY,
  sendGridKey: SENDGRID_API_KEY,
  firstName: ADMIN_FIRSTNAME,
  lastName: ADMIN_LASTNAME,
  address: ADMIN_ADDRESS,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  bvn: ADMIN_BVN,
};

export default config;
