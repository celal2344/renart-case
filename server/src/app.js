const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const cron = require('node-cron');

const config = require('./config');
const swaggerSpecs = require('./config/swagger');
const routes = require('./routes');
const { errorHandler, notFound, requestLogger } = require('./middleware');
const GoldPriceService = require('./services/GoldPriceService');

class App {
    constructor() {
        this.app = express();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
        this.setupGoldPriceUpdates();
    }

    setupMiddleware() {
        // Security middleware
        this.app.use(helmet({
            contentSecurityPolicy: false, // Disable for Swagger UI
        }));

        // Rate limiting
        const limiter = rateLimit({
            windowMs: config.rateLimit.windowMs,
            max: config.rateLimit.maxRequests,
            message: {
                success: false,
                message: 'Too many requests from this IP, please try again later.',
                error: 'RATE_LIMIT_EXCEEDED'
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use(limiter);

        // CORS
        this.app.use(cors({
            origin: config.cors.origin,
            credentials: true
        }));

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Request logging
        if (config.nodeEnv === 'development') {
            this.app.use(requestLogger);
        }
    }

    setupRoutes() {
        // Swagger documentation
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
            explorer: true,
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: config.swagger.title
        }));

        // API routes
        this.app.use(config.api.prefix, routes);

        // Root endpoint
        this.app.get('/', (req, res) => {
            res.json({
                message: 'Welcome to Jewelry Store API',
                version: '1.0.0',
                documentation: '/api-docs',
                endpoints: {
                    products: `${config.api.prefix}/products`,
                    health: `${config.api.prefix}/health`
                }
            });
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use(notFound);

        // Global error handler
        this.app.use(errorHandler);
    }

    setupGoldPriceUpdates() {
        // Try initial gold price fetch - don't fail startup if it fails
        GoldPriceService.fetchGoldPrice()
            .then(() => console.log('Initial gold price fetch completed successfully'))
            .catch(err => {
                console.warn('Initial gold price fetch failed:', err.message);
                console.log('Application will continue without pre-loaded gold price data');
                console.log('Gold prices will be fetched on first request or via cron job');
            });

        // Schedule gold price updates every hour
        cron.schedule('0 * * * *', async () => {
            console.log('Gold price update cron job started...');
            try {
                await GoldPriceService.fetchGoldPrice();
                console.log('Gold price update cron job completed successfully');
            } catch (error) {
                console.error('Gold price update cron job failed:', error.message);
                console.log('Will retry on next scheduled run');
            }
        }, {
            timezone: 'UTC'
        });

        console.log('Gold price update scheduler initialized (runs every hour)');
    }

    start() {
        this.app.listen(config.port, () => {
            console.log(`• Documentation: http://localhost:${config.port}/api-docs`);
            console.log(`• Health Check: http://localhost:${config.port}${config.api.prefix}/health`);
        });
    }

    getApp() {
        return this.app;
    }
}

module.exports = App;
