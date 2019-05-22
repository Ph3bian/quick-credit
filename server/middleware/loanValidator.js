import Validator from '../validation/validator';

/**
 * Middleware to validate user loan endpoint
 * @param {req} req express req object
 * @param {res} res express res object
 * @param {next} next express next method
 * @returns {next} next - express next method
 */
// eslint-disable-next-line import/prefer-default-export
export function requestLoanValidator(req, res, next) {
  Validator.requestLoan(req);
  const validateErrors = req.validationErrors();
  if (validateErrors) {
    return res.status(422).json({
      status: 422,
      error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
    });
  }
  return next();
}

export function fetchLoansValidator(req, res, next) {
  Validator.filterLoan(req);
  const validateErrors = req.validationErrors();
  if (validateErrors) {
    return res.status(422).json({
      status: 422,
      error: 'Oops, Invalid query parameter',
    });
  }
  return next();
}
