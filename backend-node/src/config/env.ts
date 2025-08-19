import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
  dbName: string;
  corsOrigin: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '8001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/renace_mi_edad_dorada',
  dbName: process.env.DB_NAME || 'renace_mi_edad_dorada',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

// Validate required environment variables
const requiredEnvVars = ['MONGO_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}