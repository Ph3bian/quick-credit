import { Router } from 'express';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';
import UserController from '../controllers/userController';

const router = new Router();
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/loans', LoanController.requestLoan);
router.get('/loans', LoanController.fetchLoans);
router.patch('/users/:email/verify', UserController.verifyUser);
export default router;
