/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Default error
    let error = {
        success: false,
        message: err.message || 'Internal Server Error',
        error: err.name || 'UNKNOWN_ERROR'
    };

    // Specific error types
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.error = 'VALIDATION_ERROR';
    } else if (err.message.includes('not found')) {
        error.statusCode = 404;
        error.error = 'NOT_FOUND';
    } else if (err.message.includes('required')) {
        error.statusCode = 400;
        error.error = 'MISSING_REQUIRED_FIELD';
    } else {
        error.statusCode = 500;
    }

    // Don't expose stack trace in production
    if (process.env.NODE_ENV === 'production') {
        delete error.stack;
    } else {
        error.stack = err.stack;
    }

    res.status(error.statusCode || 500).json(error);
};

/**
 * Handle 404 routes
 */
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
        error: 'ROUTE_NOT_FOUND'
    });
};

/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, url, ip } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        console.log(`[${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`);
    });

    next();
};

/**
 * Validate query parameters middleware
 */
const validateQueryParams = (allowedParams = []) => {
    return (req, res, next) => {
        const queryKeys = Object.keys(req.query);
        const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid query parameters: ${invalidParams.join(', ')}`,
                error: 'INVALID_QUERY_PARAMS',
                allowedParams
            });
        }

        next();
    };
};

/**
 * Async wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFound,
    requestLogger,
    validateQueryParams,
    asyncHandler
};
