import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { NewsVideo, INewsVideoCreate, INewsVideoUpdate } from '../models/NewsVideo';
import { ApiResponse } from '../types/api';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation middleware
const validateNewsVideo = [
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('video_id')
    .isString()
    .trim()
    .isLength({ min: 11, max: 11 })
    .matches(/^[a-zA-Z0-9_-]{11}$/)
    .withMessage('video_id must be a valid YouTube video ID (11 characters)'),
  body('thumbnail')
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('week')
    .matches(/^\d{4}-W\d{2}$/)
    .withMessage('Week must be in format YYYY-WNN (e.g., 2024-W03)'),
];

const validateNewsVideoUpdate = [
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('video_id')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 11, max: 11 })
    .matches(/^[a-zA-Z0-9_-]{11}$/)
    .withMessage('video_id must be a valid YouTube video ID (11 characters)'),
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  body('week')
    .optional()
    .matches(/^\d{4}-W\d{2}$/)
    .withMessage('Week must be in format YYYY-WNN (e.g., 2024-W03)'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean'),
];

// Helper function to handle validation errors
const handleValidationErrors = (req: express.Request, res: express.Response<ApiResponse>): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: errors.array().map(err => err.msg).join(', '),
    });
    return true;
  }
  return false;
};

// GET /api/news-videos - Get all active news videos
router.get('/', asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
  try {
    const videos = await NewsVideo.find({ is_active: true })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();

    console.log(`🎥 Retrieved ${videos.length} news videos`);
    
    res.json({
      success: true,
      data: videos,
    });
  } catch (error) {
    console.error('❌ Error fetching news videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving news videos',
    });
  }
}));

// POST /api/news-videos - Create new news video
router.post('/', validateNewsVideo, asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const videoData: INewsVideoCreate = req.body;

    // Create new video
    const video = new NewsVideo(videoData);
    await video.save();

    console.log(`✅ Created news video: ${videoData.title}`);

    res.status(201).json({
      success: true,
      message: 'News video created successfully',
      data: video.toObject(),
    });
  } catch (error) {
    console.error('❌ Error creating news video:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating news video',
    });
  }
}));

// PUT /api/news-videos/:id - Update news video
router.put('/:id', 
  param('id').isString().withMessage('Video ID must be a string'),
  validateNewsVideoUpdate, 
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const updateData: INewsVideoUpdate = req.body;

      // Find and update video
      const video = await NewsVideo.findOneAndUpdate(
        { id },
        { ...updateData, updated_at: new Date() },
        { new: true, runValidators: true }
      );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'News video not found',
        });
      }

      console.log(`✅ Updated news video ${id}`);

      res.json({
        success: true,
        message: 'News video updated successfully',
        data: video.toObject(),
      });
    } catch (error) {
      console.error('❌ Error updating news video:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating news video',
      });
    }
  })
);

// DELETE /api/news-videos/:id - Soft delete news video
router.delete('/:id',
  param('id').isString().withMessage('Video ID must be a string'),
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;

      const video = await NewsVideo.findOneAndUpdate(
        { id },
        { is_active: false, updated_at: new Date() },
        { new: true }
      );

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'News video not found',
        });
      }

      console.log(`🗑️ Deleted news video ${id}`);

      res.json({
        success: true,
        message: 'News video deleted successfully',
      });
    } catch (error) {
      console.error('❌ Error deleting news video:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting news video',
      });
    }
  })
);

export default router;