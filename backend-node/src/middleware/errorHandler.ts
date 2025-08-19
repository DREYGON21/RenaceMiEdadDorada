import { Request, Response, NextFunction } from 'express';
import { ApiResponse, ApiError } from '../types/api';

export const errorHandler = (
  error: ApiError | Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle known API errors
  if ('statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  // Handle Mongoose cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Handle duplicate key errors
  if (error.name === 'MongoServerError' && 'code' in error && error.code === 11000) {
    statusCode = 400;
    message = 'Duplicate entry';
  }

  // Log error for debugging
  console.error('❌ Error:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
};

export const notFoundHandler = (req: Request, res: Response<ApiResponse>): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};