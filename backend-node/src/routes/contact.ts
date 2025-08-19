import express from 'express';
import { body, query, param, validationResult } from 'express-validator';
import { ContactMessage, IContactMessageCreate, IContactMessageUpdate } from '../models/ContactMessage';
import { ApiResponse, PaginatedResponse, MessageStatus } from '../types/api';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation middleware
const validateContactMessage = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('subject')
    .isString()
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Subject must be between 1 and 300 characters'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
];

const validateContactMessageUpdate = [
  body('status')
    .optional()
    .isIn(Object.values(MessageStatus))
    .withMessage(`Status must be one of: ${Object.values(MessageStatus).join(', ')}`),
];

// Helper function to handle validation errors
const handleValidationErrors = (req: express.Request, res: express.Response<ApiResponse>) => {
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

// POST /api/contact - Submit contact form
router.post('/', validateContactMessage, asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
  if (handleValidationErrors(req, res)) return;

  try {
    const messageData: IContactMessageCreate = req.body;

    // Create new contact message
    const contactMessage = new ContactMessage(messageData);
    await contactMessage.save();

    console.log(`📩 New contact message from: ${messageData.email}`);

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: contactMessage.toObject(),
    });
  } catch (error) {
    console.error('❌ Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
    });
  }
}));

// GET /api/contact-messages - Get contact messages (admin endpoint)
router.get('/messages', asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as MessageStatus;
    
    // Build filter
    const filter: any = {};
    if (status && Object.values(MessageStatus).includes(status)) {
      filter.status = status;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Get messages with pagination
    const [messages, total] = await Promise.all([
      ContactMessage.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactMessage.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    console.log(`📋 Retrieved ${messages.length} contact messages (page ${page}/${totalPages})`);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contact messages',
    });
  }
}));

// PUT /api/contact-messages/:id - Update contact message status (admin endpoint)
router.put('/messages/:id',
  param('id').isString().withMessage('Message ID must be a string'),
  validateContactMessageUpdate,
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;
      const updateData: IContactMessageUpdate = req.body;

      const message = await ContactMessage.findOneAndUpdate(
        { id },
        { ...updateData, updated_at: new Date() },
        { new: true, runValidators: true }
      );

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found',
        });
      }

      console.log(`✅ Updated contact message ${id} status to ${updateData.status}`);

      res.json({
        success: true,
        message: 'Contact message updated successfully',
        data: message.toObject(),
      });
    } catch (error) {
      console.error('❌ Error updating contact message:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating contact message',
      });
    }
  })
);

// GET /api/contact-messages/:id - Get specific contact message (admin endpoint)
router.get('/messages/:id',
  param('id').isString().withMessage('Message ID must be a string'),
  asyncHandler(async (req: express.Request, res: express.Response<ApiResponse>) => {
    if (handleValidationErrors(req, res)) return;

    try {
      const { id } = req.params;

      const message = await ContactMessage.findOne({ id }).lean();

      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Contact message not found',
        });
      }

      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      console.error('❌ Error fetching contact message:', error);
      res.status(500).json({
        success: false,
        message: 'Error retrieving contact message',
      });
    }
  })
);

export default router;