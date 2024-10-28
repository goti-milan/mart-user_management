import userRoutes from './userRoutes'
import express from 'express';
const router = express.Router();

router.use('/', userRoutes);


export default router;
