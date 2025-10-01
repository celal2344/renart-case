const parseNumericParam = (param, defaultValue, min = null, max = null) => {
    if (!param) return defaultValue;
    const parsed = parseFloat(param);
    if (isNaN(parsed)) return defaultValue;
    if (min !== null && parsed < min) return min;
    if (max !== null && parsed > max) return max;
    return parsed;
};

const calculateProductPrice = (popularityScore, weight, pricePerGram) => {
    return Number(((popularityScore + 1) * weight * pricePerGram).toFixed(2));
};

const applyFilters = (products, filters) => {
    let filtered = [...products];

    if (filters.minPrice !== null || filters.maxPrice !== null) {
        filtered = filtered.filter(product => {
            const price = product.price;
            return price >= filters.minPrice && price <= filters.maxPrice;
        });
    }

    if (filters.minPopularity !== null || filters.maxPopularity !== null) {
        filtered = filtered.filter(product => {
            const popularity = product.popularityScore;
            return popularity >= filters.minPopularity && popularity <= filters.maxPopularity;
        });
    }

    return filtered;
};

const validateFilters = (filters) => {
    const errors = [];

    if (filters.minPrice > filters.maxPrice) {
        errors.push({
            field: 'priceRange',
            message: 'minPrice cannot be greater than maxPrice',
            code: 'INVALID_PRICE_RANGE'
        });
    }

    if (filters.minPopularity > filters.maxPopularity) {
        errors.push({
            field: 'popularityRange',
            message: 'minPopularity cannot be greater than maxPopularity',
            code: 'INVALID_POPULARITY_RANGE'
        });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    parseNumericParam,
    calculateProductPrice,
    applyFilters,
    validateFilters
};
