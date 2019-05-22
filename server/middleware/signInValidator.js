import Validator from '../validation/validator';

/**
 * Middleware to validate user sign-in endpoint
 * @param {req} req express req object
 * @param {res} res express res object
 * @param {next} next express next method
 * @returns {next} next - express next method
 */
export default async (req, res, next) => {
  Validator.userSignIn(req);
  const validateErrors = req.validationErrors();
  if (validateErrors) {
    return res.status(422).json({
      status: 422,
      error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
    });
  }
  return next();
};
