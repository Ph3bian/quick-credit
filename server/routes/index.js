import { Router } from 'express';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';
import UserController from '../controllers/userController';

const router = new Router();
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/loans', LoanController.requestLoan);
router.get('/loans', LoanController.fetchLoans);
router.get('/loans/:id', LoanController.fetchLoan);
router.patch('/loans/:id', LoanController.updateLoan);
router.post('/loans/:loanId/repayment', LoanController.updateRepayment);
router.get('/loans/:loanId/repayments', LoanController.fetchRepayments);
router.patch('/users/:email/verify', UserController.verifyUser);

// eslint-disable-next-line no-unused-vars
router.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    error: error.message,
  });
});
export default router;
