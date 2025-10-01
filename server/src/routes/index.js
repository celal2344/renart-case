const express = require('express');
const productRoutes = require('./products');
const cronRoutes = require('./cron');

const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Jewelry Store API',
        version: '1.0.0'
    });
});

router.use('/products', productRoutes);
router.use('/cron', cronRoutes);

module.exports = router;
