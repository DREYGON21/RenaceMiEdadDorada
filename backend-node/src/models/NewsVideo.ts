import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface INewsVideo extends Document {
  id: string;
  title: string;
  video_id: string;
  thumbnail: string;
  week: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface INewsVideoCreate {
  title: string;
  video_id: string;
  thumbnail: string;
  week: string;
  is_active?: boolean;
}

export interface INewsVideoUpdate {
  title?: string;
  video_id?: string;
  thumbnail?: string;
  week?: string;
  is_active?: boolean;
}

const NewsVideoSchema = new Schema<INewsVideo>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    video_id: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      validate: {
        validator: (v: string) => {
          // Basic YouTube video ID validation (11 characters, alphanumeric + - _)
          return /^[a-zA-Z0-9_-]{11}$/.test(v);
        },
        message: 'Invalid YouTube video ID format',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => {
          // Basic URL validation
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Thumbnail must be a valid URL',
      },
    },
    week: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          // Format: YYYY-WNN (e.g., 2024-W03)
          return /^\d{4}-W\d{2}$/.test(v);
        },
        message: 'Week must be in format YYYY-WNN (e.g., 2024-W03)',
      },
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        ret._id = ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (doc, ret) => {
        ret._id = ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better query performance
NewsVideoSchema.index({ is_active: 1, created_at: -1 });
NewsVideoSchema.index({ week: 1, is_active: 1 });

export const NewsVideo = mongoose.model<INewsVideo>('NewsVideo', NewsVideoSchema);