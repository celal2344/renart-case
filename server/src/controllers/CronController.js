const GoldPriceService = require('../services/GoldPriceService');

class CronController {
    /**
     * @swagger
     * /api/cron:
     *   get:
     *     summary: Cron job to update gold prices
     *     tags: [Cron]
     *     responses:
     *       200:
     *         description: Gold price update completed
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     */
    async updateGoldPrice(req, res) {
        try {
            console.log('Cron job triggered: Updating gold price...');
            
            await GoldPriceService.fetchGoldPrice();
            const currentData = GoldPriceService.getCurrentGoldPrice();
            
            res.json({
                success: true,
                message: 'Gold price updated successfully',
                data: {
                    pricePerGram: currentData.pricePerGram,
                    lastUpdated: currentData.lastUpdated,
                    platform: currentData.platform,
                    spreadProfile: currentData.spreadProfile
                }
            });
        } catch (error) {
            console.error('Cron job error:', error.message);
            res.status(503).json({
                success: false,
                message: 'Failed to update gold price - external API unavailable',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = new CronController();
