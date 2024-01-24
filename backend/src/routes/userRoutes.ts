// src/routes/userRoutes.ts

import express from 'express';
import { getUserDetails } from '../controllers/userController';

const router = express.Router();

router.get('/:username', getUserDetails);

export default router;
