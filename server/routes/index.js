import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = new Router();
router.post('/signup', AuthController.signUp);

export default router;
