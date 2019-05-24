import client from '../connection';

export default {
  findById: id => client.query({
    text: 'SELECT * FROM repayments WHERE id = $1 LIMIT 1;',
    values: [id],
  }),
  create: ({
    paidAmount,
    loanId,
  }) => client.query({
    text: 'INSERT INTO repayments (amount, "loanId", "createdOn") VALUES($1, $2, $3) RETURNING *',
    values: [paidAmount, loanId, new Date()],
  }),
  findAll: loanId => client.query({
    text: 'SELECT * FROM repayments WHERE "loanId" = $1',
    values: [loanId],
  }),
};
