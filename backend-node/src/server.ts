import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { Database } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

class Server {
  private app: express.Application;
  private database: Database;

  constructor() {
    this.app = express();
    this.database = Database.getInstance();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS middleware
    this.app.use(cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Logging middleware
    this.app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    // Mount API routes with /api prefix
    this.app.use('/api', apiRoutes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Renace Mi Edad Dorada API Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connect to database
      await this.database.connect();

      // Start server
      this.app.listen(config.port, '0.0.0.0', () => {
        console.log('🚀 Server Information:');
        console.log(`   ✅ Environment: ${config.nodeEnv}`);
        console.log(`   ✅ Port: ${config.port}`);
        console.log(`   ✅ Database: Connected to MongoDB`);
        console.log(`   ✅ CORS: ${config.corsOrigin}`);
        console.log(`   🌐 Server running at: http://0.0.0.0:${config.port}`);
        console.log(`   📋 API routes available at: http://0.0.0.0:${config.port}/api`);
        console.log(`   ❤️  Health check: http://0.0.0.0:${config.port}/health`);
      });

      // Graceful shutdown handling
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
    
    try {
      await this.database.disconnect();
      console.log('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new Server();
server.start().catch((error) => {
  console.error('❌ Server startup error:', error);
  process.exit(1);
});