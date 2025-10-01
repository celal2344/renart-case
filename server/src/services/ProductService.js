const Product = require('../models/Product');
const GoldPriceService = require('./GoldPriceService');
const {
    calculateProductPrice,
    applyFilters,
    parseNumericParam,
    validateFilters
} = require('../utils/helpers');

class ProductService {
    constructor() {
        this.productModel = Product;
        this.goldPriceService = GoldPriceService;
    }

    async getProducts(options = {}) {
        const {
            minPrice,
            maxPrice,
            minPopularity,
            maxPopularity
        } = options;

        const filters = {
            minPrice: parseNumericParam(minPrice, 0, 0),
            maxPrice: parseNumericParam(maxPrice, Infinity, 0),
            minPopularity: parseNumericParam(minPopularity, 0, 0, 1),
            maxPopularity: parseNumericParam(maxPopularity, 1, 0, 1)
        };

        const validation = validateFilters(filters);
        if (!validation.isValid) {
            throw new Error(validation.errors[0].message);
        }

        const products = this.productModel.getAll();

        // Always update gold prices on every product request
        try {
            console.log('Updating gold prices for product request...');
            await this.goldPriceService.fetchGoldPrice();
        } catch (error) {
            console.warn('Failed to update gold prices:', error.message);
            // Continue with existing data if available
        }

        const goldPriceData = this.goldPriceService.getCurrentGoldPrice();

        // Check if we have valid gold price data after update attempt
        if (!goldPriceData.pricePerGram || goldPriceData.pricePerGram === 0) {
            throw new Error('Unable to retrieve current gold prices. Please try again later or contact support if the issue persists.');
        }

        // Check if data is recent (within last hour for better freshness)
        const isStaleData = goldPriceData.lastUpdated &&
            new Date() - new Date(goldPriceData.lastUpdated) > 60 * 60 * 1000; // 1 hour instead of 24 hours

        let enrichedProducts = products.map((product, index) => ({
            ...product,
            id: index,
            price: calculateProductPrice(product.popularityScore, product.weight, goldPriceData.pricePerGram),
            popularityScoreOutOf5: Number((product.popularityScore * 5).toFixed(1)),
            pricePerGram: Number((calculateProductPrice(product.popularityScore, product.weight, goldPriceData.pricePerGram) / product.weight).toFixed(2))
        }));

        let filteredProducts = applyFilters(enrichedProducts, filters);

        const response = {
            success: true,
            data: filteredProducts,
            total: filteredProducts.length,
            filters: {
                applied: {
                    priceRange: filters.minPrice > 0 || filters.maxPrice < Infinity ?
                        { min: filters.minPrice, max: filters.maxPrice } : null,
                    popularityRange: filters.minPopularity > 0 || filters.maxPopularity < 1 ?
                        { min: filters.minPopularity, max: filters.maxPopularity } : null
                }
            },
            goldPrice: {
                ...goldPriceData,
                isStale: isStaleData
            }
        };

        // Add info about real-time pricing
        if (isStaleData) {
            response.warning = 'Gold price data may be outdated despite recent update attempt.';
        } else {
            response.info = 'Prices updated with current market data.';
        }

        return response;
    }
}

module.exports = new ProductService();
