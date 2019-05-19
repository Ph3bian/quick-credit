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
    loanType,
    accountNo,
    userId,
  }) => client.query({
    text: 'INSERT INTO loans(amount, tenor, balance, interest, paymentInstallment, createdOn, loanType, accountNo, userId) VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *', values: [amount, tenor, (amount * 1.05), (amount * 0.05), (amount + (amount * 0.05)) / tenor, new Date(), loanType, accountNo, userId],
  }),
  findAll: () => client.query({
    text: 'SELECT * FROM loans',
    values: [],
  }),
};
