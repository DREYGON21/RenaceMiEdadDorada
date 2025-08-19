import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { Activity, IActivityCreate, IActivityUpdate } from '../models/Activity';
import { ApiResponse } from '../types/api';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation middleware
const validateActivity = [
  body('week')
    .isInt({ min: 1, max: 5 })
    .withMessage('Week must be an integer between 1 and 5'),
  body('title')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
];

const validateActivityUpdate = [
  body('week')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Week must be an integer between 1 and 5'),
  body('title')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  body('images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
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

// GET /api/activities - Get all active activities
router.get('/', asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
  try {
    const activities = await Activity.find({ is_active: true })
      .sort({ week: 1 })
      .limit(100)
      .lean();

    console.log(`📋 Retrieved ${activities.length} activities`);
    
    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error('❌ Error fetching activities:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving activities',
    });
  }
}));

// POST /api/activities - Create new activity
router.post('/', validateActivity, asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>): Promise<void> => {
  if (handleValidationErrors(req, res)) return;

  try {
    const activityData: IActivityCreate = req.body;

    // Check if week already exists
    const existingActivity = await Activity.findOne({ 
      week: activityData.week, 
      is_active: true 
    });

    if (existingActivity) {
      return res.status(400).json({
        success: false,
        message: `Activity for week ${activityData.week} already exists`,
      });
    }

    // Create new activity
    const activity = new Activity(activityData);
    await activity.save();

    console.log(`✅ Created activity for week ${activityData.week}`);

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity.toObject(),
    });
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
    });
  }
}));

// PUT /api/activities/:id - Update activity
router.put('/:id', 
  param('id').isString().withMessage('Activity ID must be a string'),
  validateActivityUpdate, 
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const updateData: IActivityUpdate = req.body;

      // Find and update activity
      const activity = await Activity.findOneAndUpdate(
        { id },
        { ...updateData, updated_at: new Date() },
        { new: true, runValidators: true }
      );

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found',
        });
      }

      console.log(`✅ Updated activity ${id}`);

      res.json({
        success: true,
        message: 'Activity updated successfully',
        data: activity.toObject(),
      });
    } catch (error) {
      console.error('❌ Error updating activity:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating activity',
      });
    }
  })
);

// DELETE /api/activities/:id - Soft delete activity
router.delete('/:id',
  param('id').isString().withMessage('Activity ID must be a string'),
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;

      const activity = await Activity.findOneAndUpdate(
        { id },
        { is_active: false, updated_at: new Date() },
        { new: true }
      );

      if (!activity) {
        return res.status(404).json({
          success: false,
          message: 'Activity not found',
        });
      }

      console.log(`🗑️ Deleted activity ${id}`);

      res.json({
        success: true,
        message: 'Activity deleted successfully',
      });
    } catch (error) {
      console.error('❌ Error deleting activity:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting activity',
      });
    }
  })
);

export default router;