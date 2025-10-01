require('dotenv').config();

const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    api: {
        prefix: process.env.API_PREFIX || '/api',
        version: process.env.API_VERSION || 'v1'
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    goldPrice: {
        apiUrl: process.env.SWISSQUOTE_API_URL || 'https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD'
    },
    cors: {
        origin: process.env.CORS_ORIGIN || '*'
    },
    swagger: {
        title: process.env.SWAGGER_TITLE || 'Jewelry Store API',
        description: process.env.SWAGGER_DESCRIPTION || 'API for managing jewelry products with real-time gold pricing',
        version: process.env.SWAGGER_VERSION || '1.0.0'
    }
};

module.exports = config;
