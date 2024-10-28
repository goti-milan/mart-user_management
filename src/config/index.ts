import dotenv from 'dotenv';
dotenv.config();


export const PORT = process.env.PORT;
export const DB_HOST = process.env.DB_HOST
export const DB_PORT = process.env.DB_PORT
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const SALT_ROUND = Number(process.env.SALT_ROUND) || 10
export const EMAIL_USER = process.env.EMAIL_USER
export const EMAIL_PASS = process.env.EMAIL_PASS
export const JWT_SECREAT_KEY = "access token refresh key"
export const NODE_ENV = process.env.NODE_ENV
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY


