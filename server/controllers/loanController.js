/* eslint-disable eqeqeq */
import loanModel from '../database/models/loan';
import userModel from '../database/models/user';
import repaymentModel from '../database/models/repayment';

export default class LoanController {
  /**
 * Create a loan application: POST /loans
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static requestLoan(req, res) {
    const setLoan = true;
    const { status, activeLoan, email } = req.user;
    if (status === 'unverified') {
      return res.status(400).json({
        status: 400,
        error: 'User must be verified to apply for loan',
      });
    }
    if (activeLoan === true) {
      return res.status(400).json({
        status: 400,
        error: 'You can only request for one loan at a time',
      });
    }

    loanModel.create(req.body).then(({ rows }) => {
      userModel.updateActiveLoan(email, setLoan)
        .then(
          response => res.status(200).json({
            status: 200,
            data: 'Loan updated successfully',
          }),
        ).catch(error => res.status(500).json({
          status: 500,
          error: error.message,
        }));

      return res.status(201).json({
        status: 201,
        loan: rows[0],
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: error.message,
    }));
  }


  /**
  * Get all loan applications: GET /loans
  * @param {req} req express req object
  * @param {res} res express res object
  */
  static fetchLoans(req, res) {
    const { status, repaid } = req.query;
    loanModel.findAll(req.body).then(({ rows }) => {
      let filteredLoans = rows.slice();

      if (status && ['approved', 'rejected', 'pending'].includes(status)) {
        filteredLoans = filteredLoans.filter(loan => loan.status === status);
      }
      if (repaid && ['true', 'false'].includes(repaid)) {
        filteredLoans = filteredLoans.filter(loan => loan.repaid.toString() === repaid);
      }
      return res.status(200).json({
        status: 200,
        data: filteredLoans,
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: error.message,
    }));
  }

  /**
 * Get specific loan application: GET /loans/<:loan-id>
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static fetchLoan(req, res) {
    const { id } = req.params;

    loanModel.findById(id).then((result) => {
      const loan = result.rows[0];
      if (!loan) {
        return res.status(404).json({
          status: 404,
          error: 'Loan application not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: loan,
      });
    }).catch(error => res.status(500).json({
      status: 500,
      error: error.message,
    }));
  }

  /**
 * Approve or reject a loan application: PATCH /loans/<:loan-id>
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static async updateLoan(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const { rows } = await loanModel.findById(id);
      if (rows.length == 0) {
        return res.status(404).json({
          status: 404,
          error: 'Loan application does not exist',
        });
      }
      const loan = rows[0];
      if (loan && ['approved', 'rejected'].includes(status)) {
        try {
          const result = await loanModel.updateLoanStatus(id, status);
          const updatedLoan = result.rows[0];
          return res.status(200).json({
            status: 200,
            data: updatedLoan,
          });
        } catch (error) {
          return res.status(500).json({
            error: error.message,
            status: 500,
          });
        }
      }
      return res.status(400).json({
        status: 400,
        error: 'Status can only be approved or rejected',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }


  /**
 *Create a loan repayment record: POST /loans/<:loan-id>/repayment
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static async updateRepayment(req, res) {
    let repaid = false;
    const { loanId } = req.params;
    const { email } = req.user;
    const {
      amount, paidAmount,
    } = req.body;
    try {
      const { rows } = await loanModel.findById(loanId);

      if (rows.length == 0) {
        return res.status(404).json({
          status: 404,
          error: 'Loan application does not exist',
        });
      }
      const loan = rows[0];

      const previousbalance = loan.balance;
      if (previousbalance == 0) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: 'Loan has been repaid',
        });
      }

      if (paidAmount > previousbalance) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: `Amount to be repaid can not be more than amount borrowed, kindly pay installment ${loan.paymentinstallment}`,
        });
      }
      if (paidAmount != loan.paymentinstallment) {
        return res.status(400).json({
          status: 400,
          success: false,
          error: `Amount to be repaid is ${loan.paymentinstallment}, kindly inform user`,
        });
      }
      repaymentModel.create({ paidAmount, loanId }).then((result) => {
        const newRepayments = result.rows[0];
        const newLoanBalance = previousbalance - paidAmount;
        console.log(newLoanBalance, 'loan balance');
        // eslint-disable-next-line no-unused-expressions
        if (newLoanBalance == 0) {
          repaid = true;
          const setLoan = false;
          console.log(setLoan, 'set the loan');
          userModel.updateActiveLoan(email, setLoan)
            .then((response) => {
              console.log(response);
              return res.status(200).json({
                status: 200,
                data: { message: 'activeLoan status updated successfully' },
              });
            }).catch(error => res.status(500).json({
              status: 500,
              error: error.message,
            }));
        }
        loanModel.updateLoanBalance(repaid, newLoanBalance, loanId).then(response => res.status(200).json({
          status: 200,
          data: {
            message: 'Loan status updated successfully',
          },
        })).catch(error => res.status(500).json({
          status: 500,
          error: error.message,
        }));

        return res.status(200).json({
          status: 200,
          data: newRepayments,
        });
      }).catch(error => res.status(500).json({
        status: 500,
        error: error.message,
      }));
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
 *View loan repayment history: GET /loans/<:loan-id>/repayments
 * @param {req} req express req object
 * @param {res} res express res object
 */
  static async fetchRepayments(req, res) {
    const { loanId } = req.params;

    try {
      const { rows } = await loanModel.findById(loanId);

      if (!rows) {
        return res.status(404).json({
          status: 404,
          error: 'Loan application does not exist',
        });
      }
      try {
        const result = await repaymentModel.findAll(loanId);
        const loanRepayments = result.rows;
        return res.status(200).json({
          status: 200,
          data: loanRepayments,
        });
      } catch (error) {
        return res.status(500).json({
          status: 500,
          error: error.message,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
}
