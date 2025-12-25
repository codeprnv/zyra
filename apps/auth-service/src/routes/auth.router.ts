import express, { type Router } from 'express';
import { verifyForgotPasswordOtp } from 'src/utils/auth.helper.js';
import {
    loginUser,
    resetUserPassword,
    userForgotPassword,
    userRegistration,
    verifyUser,
} from '../controllers/auth.controller.js';

const router: Router = express.Router();

router.post('/user-registration', userRegistration);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/forgot-password-user', userForgotPassword);
router.post('/reset-password-user', resetUserPassword);
router.post('/verify-forgot-password-user', verifyForgotPasswordOtp);

export default router;
