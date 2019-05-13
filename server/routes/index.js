import { Router } from 'express';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';
import UserController from '../controllers/userController';
import ErrorHandler from '../errorHandler/errorHandler';

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

router.use(ErrorHandler);
export default router;
