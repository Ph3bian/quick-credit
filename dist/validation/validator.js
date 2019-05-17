"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Validator =
/*#__PURE__*/
function () {
  function Validator() {
    (0, _classCallCheck2["default"])(this, Validator);
  }

  (0, _createClass2["default"])(Validator, null, [{
    key: "user",
    value: function user(req) {
      req.checkBody('firstName', 'First name is required').notEmpty().isLength({
        min: 2
      });
      req.checkBody('firstName', 'First name must be alphabets').isAlpha();
      req.checkBody('lastName', 'Last name is required').notEmpty().isLength({
        min: 2
      });
      req.checkBody('lastName', 'Last name Must be alphabets').isAlpha();
      req.checkBody('email', 'Valid email is required').notEmpty().isEmail();
      req.checkBody('password', 'Password is required').notEmpty();
      req.checkBody('password', 'Password must be 6 characters or more').isLength({
        min: 6
      });
      req.checkBody('address', 'Address is required').notEmpty();
      req.checkBody('bvn', 'BVN is required').notEmpty();
      req.checkBody('bvn', 'BVN must be 11 characters').isLength({
        min: 11,
        max: 11
      });
    }
  }, {
    key: "userSignIn",
    value: function userSignIn(req) {
      req.checkBody('email', 'Valid email is required').notEmpty().isEmail();
      req.checkBody('password', 'Password is required').notEmpty();
    }
  }, {
    key: "requestLoan",
    value: function requestLoan(req) {
      req.checkBody('amount', 'Amount is required').notEmpty();
      req.checkBody('amount', 'Minimum amount is ₦1000 required').isInt({
        min: 1000
      });
      req.checkBody('tenor', 'tenor is required').notEmpty();
      req.checkBody('tenor', 'minimum tenor required is 1month').isInt({
        min: 1
      });
      req.checkBody('loanType', 'Select loan type').isAlpha();
      req.checkBody('loanType', 'Invalid Loan type').isAlpha().isLength({
        min: 2,
        max: 2
      });
      req.checkBody('accountNo', 'Account no. is required').notEmpty();
      req.checkBody('accountNo', 'Minimum account no. length is 10 characters').isLength({
        min: 10,
        max: 10
      }); // req.checkBody('bankName', 'Bank name is required').notEmpty();
      // req.checkBody('bankName', 'Enter valid name of  bank').isAlpha();
    }
  }, {
    key: "verifyUser",
    value: function verifyUser(req) {
      req.check('email', 'Valid email address required').notEmpty().isEmail();
    }
  }, {
    key: "filterLoan",
    value: function filterLoan(req) {
      var _req$query = req.query,
          status = _req$query.status,
          repaid = _req$query.repaid;
      if (status) req.check('status').isIn(['approved', 'pending', 'rejected']);
      if (repaid) req.check('repaid').isIn(['true', 'false']);
    }
  }]);
  return Validator;
}();

exports["default"] = Validator;