import express from 'express';
import { validateLogin, validateSignUp } from '../middlewares/userValidation';
import { forgetPassword, loginUser, resetPassword, signUpUser  } from '../controllers';
import { limiter } from '../middlewares/rateLimiter';

const router = express.Router();

router.post('/signup', validateSignUp, signUpUser );

router.post('/login', validateLogin, loginUser);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/me', forgetPassword);


export default router;
