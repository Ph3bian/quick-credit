// import bcrypt from 'bcryptjs';
import client from '../connection';

export default {
  findById: loanId => client.query({
    text: 'SELECT * FROM loans WHERE id = $1 LIMIT 1;',
    values: [loanId],
  }),
  create: ({
    amount,
    tenor,
    interest,
    loanType,
    accountNo,
    userId,
  }) => client.query({
    text: 'INSERT INTO loans(amount, tenor, balance, interest, paymentInstallment, createdOn, loanType, accountNo, userId) VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *',
    values: [amount, tenor, (amount + interest), interest, (amount + interest) / tenor, new Date(), loanType, accountNo, userId],
  }),
};
