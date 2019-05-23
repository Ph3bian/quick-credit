export default class Validator {
  static user(req) {
    req.checkBody('firstName', 'First name is required').notEmpty().isLength({ min: 2 }).withMessage('must be at least 2 characters long')
      .customSanitizer(firstName => firstName.toLowerCase());
    req.checkBody('firstName', 'First name must be only alphabets').isAlpha();
    req.checkBody('lastName', 'Last name is required').notEmpty().isLength({ min: 2 }).withMessage('must be at least 2 characters long')
      .customSanitizer(lastName => lastName.toLowerCase());
    req.checkBody('lastName', 'Last name must be only alphabets').isAlpha();
    req.checkBody('email', 'Valid email is required').notEmpty().isEmail().customSanitizer(email => email.toLowerCase());
    req.checkBody('password', 'Password is required').notEmpty()
      .isLength({ min: 8 }).withMessage('must be at least 8 characters long')
      .matches('[0-9]')
      .withMessage('must be at least  have a number');
    req.checkBody('address', 'Address is required').notEmpty();
  }

  static userSignIn(req) {
    req.checkBody('email', 'Valid email is required').notEmpty().isEmail().customSanitizer(email => email.toLowerCase());
    req.checkBody('password', 'Password is required').notEmpty();
  }

  static requestLoan(req) {
    req.checkBody('userId', 'userid is required').notEmpty().trim().isNumeric()
      .isInt({ min: 1 })
      .withMessage('Valid "userId" parameter required');
    req.checkBody('amount').notEmpty().withMessage('Amount is required').trim()
      .isNumeric()
      .withMessage('input a valid amount')
      .isInt({ min: 1000 })
      .withMessage('Minimum amount is ₦1000 required')
      .customSanitizer(amount => parseInt(amount, 10));
    req.checkBody('tenor', 'tenor is required').notEmpty().trim().isNumeric()
      .isInt({ min: 1 })
      .withMessage('Minimum tenor required is 1 month');
    req.checkBody('loanType', 'Select loan type').isAlpha();
    req.checkBody('loanType', 'Invalid Loan type').isAlpha().isLength({ min: 2, max: 2 });
    req.checkBody('accountNo', 'Account no. is required').notEmpty();
    req.checkBody('accountNo', 'Minimum account no. length is 10 characters').isLength({ min: 10, max: 10 });
  }

  static verifyUser(req) {
    req.check('email', 'Valid email address required').notEmpty().isEmail().customSanitizer(email => email.toLowerCase());
  }

  static filterLoan(req) {
    const { status, repaid } = req.query;
    if (status) req.check('status').isIn(['approved', 'pending', 'rejected']);
    if (repaid) req.check('repaid').isIn(['true', 'false']);
  }
}
