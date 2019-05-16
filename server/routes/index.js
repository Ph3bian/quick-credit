import { Router } from 'express';
import authMiddleware from '../middleware/auth';
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
router.post('/loans', authMiddleware, requestLoanValidator, LoanController.requestLoan);
router.get('/loans', authMiddleware, fetchLoansValidator, LoanController.fetchLoans);
router.get('/loans/:id', authMiddleware, LoanController.fetchLoan);
router.patch('/loans/:id', authMiddleware, LoanController.updateLoan);
router.post('/loans/:loanId/repayment', authMiddleware, LoanController.updateRepayment);
router.get('/loans/:loanId/repayments', authMiddleware, LoanController.fetchRepayments);
router.patch('/users/:email/verify', authMiddleware, UserValidator, UserController.verifyUser);

router.use(ErrorHandler);

export default router;
