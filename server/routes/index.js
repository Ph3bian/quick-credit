import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = new Router();
router.post('/signup', AuthController.signUp);
router.post('/signin', AuthController.signIn);
export default router;
