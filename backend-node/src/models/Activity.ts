import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IActivity extends Document {
  id: string;
  week: number;
  title: string;
  description: string;
  images: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IActivityCreate {
  week: number;
  title: string;
  description: string;
  images?: string[];
  is_active?: boolean;
}

export interface IActivityUpdate {
  week?: number;
  title?: string;
  description?: string;
  images?: string[];
  is_active?: boolean;
}

const ActivitySchema = new Schema<IActivity>(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      required: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Week must be an integer between 1 and 5',
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (images: string[]) => {
          return images.every(url => 
            typeof url === 'string' && url.trim().length > 0
          );
        },
        message: 'All image URLs must be valid strings',
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

// Create compound index for week and is_active for better query performance
ActivitySchema.index({ week: 1, is_active: 1 });
ActivitySchema.index({ is_active: 1, created_at: -1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);