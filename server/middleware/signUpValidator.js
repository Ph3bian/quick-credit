import Validator from '../validation/validator';

/**
 * Middleware to validate user sign up endpoint
 * @param {req} req express req object
 * @param {res} res express res object
 * @param {next} next express next method
 * @returns {next} next - express next method
 */
// eslint-disable-next-line import/prefer-default-export
export default async (req, res, next) => {
  Validator.user(req);
  const validateErrors = await req.validationErrors();
  if (validateErrors) {
    return res.status(422).json({
      status: 422,
      success: false,
      error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
    });
  }
  return next();
};
