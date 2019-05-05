import Validator from '../validation/validator';

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
    } = req.body;
    const createdOn = new Date();
    const interest = amount * 0.05;
    const balance = amount + interest;
    const paymentInstallment = (amount + interest) / tenor;
    const data = {
      id: parseInt((Math.random() * 1000000).toFixed(), 10),
      //   user: user.id, get userId from token
      createdOn,
      balance,
      paymentInstallment,
      amount,
      tenor,
      loanType,
      accountNo,
    };

    return res.status(201).json({
      success: true,
      message: 'Great! Loan request processing',
      data,
    });
  }
}
