import { Router } from 'express';
import AuthController from '../controllers/authController';
import LoanController from '../controllers/loanController';

const router = new Router();
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
router.post('/loan', LoanController.requestLoan);
export default router;
