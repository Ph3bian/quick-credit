export default class Validator {
  static user(req) {
    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('firstname', 'First name must be alphabets').isAlpha();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('lastname', 'Last name Must be alphabets').isAlpha();
    req.checkBody('email', 'Valid email is required').notEmpty().isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
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
    req.checkBody('tenor', 'tenor is required').notEmpty();
    req.checkBody('loanType', 'tenor is required').notEmpty();
    req.checkBody('accountNo', 'tenor is required').notEmpty();
  }
}
