import Validator from '../validation/validator';
import Loans from '../memory/loans';
import User from '../memory/user';

export default class LoanController {
  static requestLoan(req, res) {
    Validator.requestLoan(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: validateErrors.map(e => ({ field: e.param, message: e.msg })),
      });
    }
    // const { user } = req.user;
    const {
      amount,
      tenor,
      loanType,
      accountNo,
      userId,
    } = req.body;
    const createdOn = new Date();
    const interest = amount * 0.05;
    const balance = amount + interest;
    const paymentInstallment = (amount + interest) / tenor;
    const status = 'pending';
    const repaid = false;
    const data = {
      id: parseInt((Math.random() * 1000000).toFixed(), 10),
      //   user: user.id, get userId from token & userEmail, userFirstName from db
      createdOn,
      balance,
      paymentInstallment,
      status,
      amount,
      tenor,
      loanType,
      repaid,
      accountNo,
    };
    const user = User.find(input => input.data.id === userId);
    const { firstname, lastname, email } = user.data.user;

    Loans.push(data); // populate in memory storage of loans
    return res.status(201).json({
      success: true,
      message: 'Great! Loan request processing',
      data: {
        firstname,
        lastname,
        email,
        ...data,
      },
    });
  }


  static fetchLoans(req, res) {
    res.status(200).json({
      success: true,
      data: Loans,
    });
  }
}
