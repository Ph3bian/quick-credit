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
    userId,
  }) => client.query({
    text: 'INSERT INTO loans(amount, tenor, balance, interest, paymentInstallment, createdOn, userId) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    values: [amount, tenor, (amount + interest), interest, (amount + interest) / tenor, new Date(), userId],
  }),
};
