import { JWT_SECREAT_KEY } from './../config/index';
import { sign, verify } from "jsonwebtoken";

// Function to create access and refresh tokens
export const createTokenPair = (data: any) => {
    return {
        accessToken: sign(data, JWT_SECREAT_KEY, { expiresIn: "1w" }), // Access token valid for 1 week
        refreshToken: sign(data, JWT_SECREAT_KEY, { expiresIn: "4w" })  // Refresh token valid for 4 weeks
    };
};

// Function to create reset password token
export const createResetPasswordToken = (data: any) => {
    return sign(data, JWT_SECREAT_KEY, { expiresIn: "1h" }) // Reset password token valid for 1 hour

};

// Function to validate/verify token
export const tokenValidation : any = (token: string) => {
    try {
        // Verify token using the secret key
        const decodedToken = verify(token, JWT_SECREAT_KEY);
        return {
            valid: true,
            item : decodedToken // Return the decoded payload if token is valid
        };
    } catch (error) {
        return {
            valid: false,
            error: 'Invalid or expired token' // Return error if token is invalid or expired
        };
    }
};
