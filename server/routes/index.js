import { Router } from 'express';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';
import UserController from '../controllers/userController';
import ErrorHandler from '../middleware/errorHandler';
import SignUpValidator from '../middleware/signUpValidator';
import SignInValidator from '../middleware/signInValidator';
import UserValidator from '../middleware/userValidator';
// eslint-disable-next-line import/named
import { requestLoanValidator, fetchLoansValidator } from '../middleware/loanValidator';


const router = new Router();
router.post('/auth/signup', SignUpValidator, AuthController.signUp);
router.post('/auth/signin', SignInValidator, AuthController.signIn);
router.post('/loans', requestLoanValidator, LoanController.requestLoan);
router.get('/loans', fetchLoansValidator, LoanController.fetchLoans);
router.get('/loans/:id', LoanController.fetchLoan);
router.patch('/loans/:id', LoanController.updateLoan);
router.post('/loans/:loanId/repayment', LoanController.updateRepayment);
router.get('/loans/:loanId/repayments', LoanController.fetchRepayments);
router.patch('/users/:email/verify', UserValidator, UserController.verifyUser);

router.use(ErrorHandler);

export default router;
