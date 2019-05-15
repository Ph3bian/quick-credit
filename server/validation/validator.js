export default class Validator {
  static user(req) {
    req.checkBody('firstname', 'First name is required').notEmpty().isLength({ min: 2 });
    req.checkBody('firstname', 'First name must be alphabets').isAlpha();
    req.checkBody('lastname', 'Last name is required').notEmpty().isLength({ min: 2 });
    req.checkBody('lastname', 'Last name Must be alphabets').isAlpha();
    req.checkBody('email', 'Valid email is required').notEmpty().isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be 6 characters or more').isLength({ min: 6 });
    req.checkBody('address', 'Address is required').notEmpty();
    req.checkBody('bvn', 'BVN is required').notEmpty();
    req.checkBody('bvn', 'BVN must be 11 characters').isLength({ min: 11, max: 11 });
  }

  static userSignIn(req) {
    req.checkBody('email', 'Valid email is required').notEmpty().isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
  }

  static requestLoan(req) {
    req.checkBody('amount', 'Amount is required').notEmpty();
    req.checkBody('amount', 'Minimum amount is ₦1000 required').isInt({ min: 1000 });
    req.checkBody('tenor', 'tenor is required').notEmpty();
    req.checkBody('tenor', 'minimum tenor required is 1month').isInt({ min: 1 });
    req.checkBody('loanType', 'Select loan type').isAlpha();
    req.checkBody('loanType', 'Invalid Loan type').isAlpha().isLength({ min: 2, max: 2 });
    req.checkBody('accountNo', 'Account no. is required').notEmpty();
    req.checkBody('accountNo', 'Minimum account no. length is 10 characters').isLength({ min: 10, max: 10 });
    req.checkBody('bankName', 'Bank name is required').notEmpty();
    req.checkBody('bankName', 'Enter valid name of  bank').isAlpha();
  }

  static verifyUser(req) {
    req.check('email', 'Valid email address required').notEmpty().isEmail();
  }

  static filterLoan(req) {
    const { status, repaid } = req.query;
    if (status) req.check('status').isIn(['approved', 'pending', 'rejected']);
    if (repaid) req.check('repaid').isIn(['true', 'false']);
  }
}
