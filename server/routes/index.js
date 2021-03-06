import { Router } from 'express';
import authMiddleware from '../middleware/auth';
import authorizeMiddleware from '../middleware/authorizeUser';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';
import UserController from '../controllers/userController';
import ErrorHandler from '../middleware/errorHandler';
import SignUpValidator from '../middleware/signUpValidator';
import SignInValidator from '../middleware/signInValidator';
import UserValidator from '../middleware/userValidator';
// eslint-disable-next-line import/named
import { requestLoanValidator, fetchLoansValidator, repaymentValidator } from '../middleware/loanValidator';


const router = new Router();
router.post('/auth/signup', SignUpValidator, AuthController.signUp);
router.post('/auth/signin', SignInValidator, AuthController.signIn);
router.post('/users/:email/reset_password', AuthController.resetPassword);
router.post('/loans', authMiddleware, requestLoanValidator, LoanController.requestLoan);
router.get('/loans', authMiddleware, authorizeMiddleware, fetchLoansValidator, LoanController.fetchLoans);
router.get('/loans/:id', authMiddleware, authorizeMiddleware, LoanController.fetchLoan);
// router.get('/loans/users/:id', authMiddleware, authorizeMiddleware, LoanController.fetchUserLoans);
router.patch('/loans/:id', authMiddleware, authorizeMiddleware, LoanController.updateLoan);
router.post('/loans/:loanId/repayment', authMiddleware, authorizeMiddleware, repaymentValidator, LoanController.updateRepayment);
router.get('/loans/:loanId/repayments', authMiddleware, LoanController.fetchRepayments);
router.patch('/users/:email/verify', authMiddleware, authorizeMiddleware, UserValidator, UserController.verifyUser);
router.patch('/users/:email/admin', authMiddleware, authorizeMiddleware, UserValidator, UserController.userIsAdmin);
router.get('/users', authMiddleware, authorizeMiddleware, UserController.getAllUsers);

router.use(ErrorHandler);


export default router;
