/* eslint-disable eqeqeq */
import Loans from '../memory/loans';
import User from '../memory/user';
import repayments from '../memory/repayments';

export default class LoanController {
  /**
 * Create a loan application: POST /loans
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static requestLoan(req, res) {
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
      interest,
    };
    const user = User.find(input => input.id === userId);
    if (user) {
      const { firstname, lastname, email } = user;

      Loans.push(data); // populate in memory storage of loans
      return res.status(201).json({
        status: 201,
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
      status: 404,
      success: false,
      error: 'Invalid User details',
    });
  }

  /**
 * Get all loan applications: GET /loans
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static fetchLoans(req, res) {
    const { status, repaid } = req.query;

    let filteredLoans = Loans.slice();


    if (status && ['approved', 'rejected', 'pending'].includes(status)) {
      filteredLoans = filteredLoans.filter(loan => loan.status === status);
    }

    if (repaid && ['true', 'false'].includes(repaid)) {
      filteredLoans = filteredLoans.filter(loan => loan.repaid.toString() === repaid);
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: filteredLoans,
    });
  }

  /**
 * Get specific loan application: GET /loans/<:loan-id>
 * @param {req} req express req object
 * @param {res} res express res object
 */
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

  /**
 * Approve or reject a loan application: PATCH /loans/<:loan-id>
 * @param {req} req express req object
 * @param {res} res express res object
 */
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
        status: 400,
        success: false,
        error: 'Error! status can only be approved or rejected',
      });
    }
    return res.status(404).json({
      status: 404,
      success: false,
      error: 'Error, loan application does not exist',
    });
  }

  /**
 *Create a loan repayment record: POST /loans/<:loan-id>/repayment
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static updateRepayment(req, res) {
    const { loanId } = req.params;
    const finder = input => input.id == loanId;
    const index = Loans.findIndex(finder);
    if (index < 0) {
      return res.status(400).json({
        status: 400,
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
      status: 200,
      success: true,
      data,
    });
  }

  /**
 *View loan repayment history: GET /loans/<:loan-id>/repayments
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static fetchRepayments(req, res) {
    const { loanId } = req.params;
    const finder = input => input.loanId == loanId;
    const repaymentsHistory = repayments.filter(finder);
    return res.status(200).json({
      status: 200,
      success: true,
      data: repaymentsHistory,
    });
  }
}
