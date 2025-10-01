const ProductService = require('../services/ProductService');
const GoldPriceService = require('../services/GoldPriceService');

class ProductController {
    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Get all products with optional filtering
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: minPrice
     *         schema:
     *           type: number
     *           minimum: 0
     *         description: Minimum price filter
     *       - in: query
     *         name: maxPrice
     *         schema:
     *           type: number
     *           minimum: 0
     *         description: Maximum price filter
     *       - in: query
     *         name: minPopularity
     *         schema:
     *           type: number
     *           minimum: 0
     *           maximum: 1
     *         description: Minimum popularity score filter (0-1)
     *       - in: query
     *         name: maxPopularity
     *         schema:
     *           type: number
     *           minimum: 0
     *           maximum: 1
     *         description: Maximum popularity score filter (0-1)
     *     responses:
     *       200:
     *         description: Successfully retrieved products
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/Product'
     *                 total:
     *                   type: integer
     *                 filters:
     *                   $ref: '#/components/schemas/FilterInfo'
     *       400:
     *         description: Invalid filter parameters
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     */
    async getProducts(req, res) {
        try {
            const result = await ProductService.getProducts(req.query);
            res.json(result);
        } catch (error) {
            // Check if it's a gold price error (503) or validation error (400)
            const statusCode = error.message.includes('gold price') ? 503 : 400;
            res.status(statusCode).json({
                success: false,
                message: error.message,
                error: statusCode === 503 ? 'GOLD_PRICE_UNAVAILABLE' : 'INVALID_FILTER_PARAMS'
            });
        }
    }

    /**
     * @swagger
     * /api/products/gold-price:
     *   get:
     *     summary: Get current gold price information
     *     tags: [Gold Price]
     *     responses:
     *       200:
     *         description: Successfully retrieved gold price data
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 data:
     *                   type: object
     *       503:
     *         description: Gold price data unavailable
     */
    async getGoldPrice(req, res) {
        try {
            const goldPriceData = GoldPriceService.getCurrentGoldPrice();
            const hasValidData = goldPriceData.pricePerGram && goldPriceData.pricePerGram > 0;
            const isStaleData = goldPriceData.lastUpdated &&
                new Date() - new Date(goldPriceData.lastUpdated) > 24 * 60 * 60 * 1000;

            if (!hasValidData) {
                return res.status(503).json({
                    success: false,
                    message: 'Gold price data is currently unavailable',
                    error: 'NO_PRICE_DATA',
                    data: null
                });
            }

            res.json({
                success: true,
                data: {
                    ...goldPriceData,
                    isStale: isStaleData,
                    status: isStaleData ?
                        'Data may be outdated - last updated ' + goldPriceData.lastUpdated :
                        'Current market data'
                },
                warning: isStaleData ? 'Price data may be outdated' : null
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                error: 'GOLD_PRICE_ERROR'
            });
        }
    }
}

module.exports = new ProductController();
