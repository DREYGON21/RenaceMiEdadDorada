export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError extends Error {
  statusCode: number;
  code?: string;
}

export enum MessageStatus {
  PENDING = 'pending',
  REPLIED = 'replied',
  ARCHIVED = 'archived'
}