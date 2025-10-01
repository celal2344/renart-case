const ProductService = require('../services/ProductService');

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
            res.status(400).json({
                success: false,
                message: error.message,
                error: 'INVALID_FILTER_PARAMS'
            });
        }
    }
}

module.exports = new ProductController();
