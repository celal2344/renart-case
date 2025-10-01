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

        let enrichedProducts = products.map((product, index) => ({
            ...product,
            id: index,
            price: calculateProductPrice(product.popularityScore, product.weight, currentGoldPrice.pricePerGram),
            popularityScoreOutOf5: Number((product.popularityScore * 5).toFixed(1)),
            pricePerGram: Number((calculateProductPrice(product.popularityScore, product.weight, currentGoldPrice.pricePerGram) / product.weight).toFixed(2))
        }));

        let filteredProducts = applyFilters(enrichedProducts, filters);

        return {
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
            }
        };
    }
}

module.exports = new ProductService();
