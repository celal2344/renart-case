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
        const currentGoldPrice = this.goldPriceService.getCurrentGoldPrice();

        // Check if we have valid gold price data
        if (!currentGoldPrice.pricePerGram || currentGoldPrice.pricePerGram === 0) {
            // Try to fetch fresh data once
            try {
                await this.goldPriceService.fetchGoldPrice();
                const updatedGoldPrice = this.goldPriceService.getCurrentGoldPrice();
                if (!updatedGoldPrice.pricePerGram || updatedGoldPrice.pricePerGram === 0) {
                    throw new Error('No gold price data available');
                }
            } catch (error) {
                throw new Error('Unable to retrieve current gold prices. Please try again later or contact support if the issue persists.');
            }
        }

        const goldPriceData = this.goldPriceService.getCurrentGoldPrice();

        // Check if data is stale (older than 24 hours)
        const isStaleData = goldPriceData.lastUpdated &&
            new Date() - new Date(goldPriceData.lastUpdated) > 24 * 60 * 60 * 1000;

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

        // Add warning if data is stale
        if (isStaleData) {
            response.warning = 'Gold price data may be outdated. Prices shown are based on the last available market data.';
        }

        return response;
    }
}

module.exports = new ProductService();
