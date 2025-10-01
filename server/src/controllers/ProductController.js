const ProductService = require('../services/ProductService');

class ProductController {
    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Get all products with optional filtering and real-time gold prices
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
     *         description: Successfully retrieved products with current gold prices
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
     *                 goldPrice:
     *                   type: object
     *                   description: Current gold price information
     *       400:
     *         description: Invalid filter parameters
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Error'
     *       503:
     *         description: Gold price service unavailable
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
}

module.exports = new ProductController();
