/* eslint-disable eqeqeq */
import Validator from '../validation/validator';
import Loans from '../memory/loans';
import User from '../memory/user';
import repayments from '../memory/repayments';

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
      userId,
    };
    const user = User.find(input => input.id === userId);
    if (user) {
      const { firstname, lastname, email } = user;

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
    return res.status(404).json({
      success: false,
      error: 'Invalid User details',
    });
  }

  static fetchLoans(req, res) {
    const { status, repaid } = req.query;

    Validator.filterLoan(req);
    const validateErrors = req.validationErrors();
    if (validateErrors) {
      return res.status(400).json({
        success: false,
        error: 'Oops, Invalid query parameter',
      });
    }

    let filteredLoans = Loans.slice();

    if (status && ['approved', 'rejected', 'pending'].includes(status)) {
      filteredLoans = filteredLoans.filter(loan => loan.status === status);
    }

    if (repaid && ['true', 'false'].includes(repaid)) {
      filteredLoans = filteredLoans.filter(loan => loan.repaid.toString() === repaid);
    }

    return res.status(200).json({
      success: true,
      data: filteredLoans,
    });
  }


  static fetchLoan(req, res) {
    const { id } = req.params;
    const finder = input => input.id == id;
    const loan = Loans.find(finder);
    if (loan) {
      return res.status(200).json({
        success: true,
        data: loan,
      });
    }
    return res.status(404).json({
      success: false,
      error: 'Error, loan application does not exist',
    });
  }

  static updateLoan(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const finder = input => input.id == id;
    const loan = Loans.find(finder);
    if (loan) {
      if (['approved', 'rejected'].includes(status)) {
        return res.status(200).json({
          success: true,
          data: {
            ...loan,
            status,
          },
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Error! status can only be approved or rejected',
      });
    }
    return res.status(404).json({
      success: false,
      error: 'Error, loan application does not exist',
    });
  }

  static updateRepayment(req, res) {
    const { loanId } = req.params;
    const finder = input => input.id == loanId;
    const index = Loans.findIndex(finder);
    if (index < 0) {
      return res.status(400).json({
        success: false,
        error: 'Error! Loan application does not exist',
      });
    }

    const previousbalance = Loans[index].balance;
    const {
      amount, paidAmount, monthlyInstallment, userId,
    } = req.body;
    const createdOn = new Date();
    const balance = previousbalance - parseInt(paidAmount, 10);
    Loans[index].balance = balance;
    const data = {
      id: parseInt((Math.random() * 1000000).toFixed(), 10),
      amount,
      paidAmount,
      monthlyInstallment,
      userId,
      createdOn,
      balance,
      loanId,
    };
    repayments.push(data);
    return res.status(200).json({
      success: true,
      data,
    });
  }
}
