import { sendEmail } from './../services/emailServices';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { generateResponse } from '../utils/responseGenerator';
import { handleError, logError } from '../utils/errorHandler';
import { createUser, findUser, updateUser } from '../services/userServices';
import { PORT, SALT_ROUND } from '../config';
import { createResetPasswordToken, createTokenPair, tokenValidation } from '../utils/JWTtokenHandler';
// import { sendEmail } from '../services/emailServices';


export const signUpUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        // Validate input using express-validator
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(generateResponse(false, 'Validation failed', errors.array()));
        }

        const { email, password } = req.body;

        // Check if the email already exists
        const existingUser = await findUser({ email });

        if (existingUser) {
            return res.status(400).json(generateResponse(false, 'Email already exists'));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user in the database
        const userData = { ...req.body, password: hashedPassword }
        const newUser = await createUser(userData);

        // Create token pairs
        const tokens = createTokenPair(newUser);

        // Send success response
        res.status(201).json(generateResponse(true, 'User registered successfully', {
            tokens
        }));

    } catch (error) {
        // Log the error for internal troubleshooting
        logError('Sign-up controller error:', error);

        // Handle the error
        handleError(res, error);
    }
});


export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // Validate input using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(generateResponse(false, 'Validation failed', errors.array()));
        }

        // Retrieve user by email
        const requestedUser = await findUser({ email });
        console.log('requestedUser', requestedUser);

        if (!requestedUser) {
            return res.status(404).json(generateResponse(false, 'User not found'));
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, requestedUser.password);
        if (!isPasswordValid) {
            return res.status(400).json(generateResponse(false, 'Invalid password, please try again'));
        }

        // Create token pair
        const tokens = createTokenPair(requestedUser);

        // Respond with tokens
        res.status(200).json(generateResponse(true, 'Login successful', { token: tokens }));
    } catch (error) {
        handleError(res, error);
    }
});


// Forgot Password Controller
export const forgetPassword = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;

        // Validate the email input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(generateResponse(false, 'Validation failed', errors.array()));
        }

        // Check if user exists
        const requestedUser = await findUser({ email });
        if (!requestedUser) {
            return res.status(404).json(generateResponse(false, 'User not found'));
        }

        console.log('requestedUser', requestedUser);


        // Generate reset password token
        const token = createResetPasswordToken({ userId: requestedUser?.id });
        console.log('token', token);


        // Generate reset link with token
        const resetLink = `http://localhost:${PORT}/api/reset-password/${token}`;

        console.log('resetLink', resetLink);


        // Send the reset password email
        // await sendEmail(email, resetLink);

        // Send success response
        return res.status(200).json(generateResponse(true, 'Password reset link sent to your email'));
    } catch (error) {
        // Handle any errors
        handleError(res, error);
    }
});

export const resetPassword = asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
        const { newPassword } = req.body;
        const { token } = req.params;

        // Validate the token and get decoded data (e.g., userId)
        const decodedToken = tokenValidation(token);
        console.log('decodedToken', decodedToken);

        if (!decodedToken || !decodedToken?.valid) {
            return res.status(400).json(generateResponse(false, 'Invalid or expired token'));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password using the ID from the token
        const updatedUser = await updateUser({ password: hashedPassword }, { id: decodedToken?.item?.userId });

        if (!updatedUser) {
            return res.status(404).json(generateResponse(false, 'User not found'));
        }

        // Send success response
        return res.status(200).json(generateResponse(true, 'Password has been reset successfully'));
    } catch (error) {
        // Handle any errors
        handleError(res, error);
    }
});




