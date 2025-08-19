import express from 'express';
import { ApiResponse } from '../types/api';

// Import route modules
import activitiesRouter from './activities';
import newsVideosRouter from './newsVideos';
import contactRouter from './contact';

const router = express.Router();

// Health check endpoint
router.get('/', (req: express.Request, res: express.Response<ApiResponse>) => {
  res.json({
    success: true,
    message: 'Renace Mi Edad Dorada API - Backend funcionando correctamente',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// Mount route modules
router.use('/activities', activitiesRouter);
router.use('/news-videos', newsVideosRouter);
router.use('/contact', contactRouter);

export default router;