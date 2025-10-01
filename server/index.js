const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS for Vercel deployment
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://vercel.app', 'https://*.vercel.app']
        : ['http://localhost:3000', 'http://localhost:5000'],
    credentials: true
}));

app.use(express.json());

let goldPriceData = {
    askPrice: 0,
    bidPrice: 0,
    pricePerGram: 0,
    lastUpdated: null
};

// Initialize gold price on startup
fetchGoldPrice();

// Fetch gold price every 5 minutes
setInterval(fetchGoldPrice, 5 * 60 * 1000);

async function fetchGoldPrice() {
    try {
        const response = await axios.get('https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD');

        if (response.data && response.data.length > 0) {
            let selectedQuote = null;
            let selectedProfile = null;

            const profilePriority = ['standard', 'premium', 'prime', 'elite'];

            for (const platform of response.data) {
                if (platform.spreadProfilePrices && platform.spreadProfilePrices.length > 0) {
                    for (const priorityProfile of profilePriority) {
                        const profile = platform.spreadProfilePrices.find(p =>
                            p.spreadProfile === priorityProfile
                        );
                        if (profile) {
                            selectedQuote = profile;
                            selectedProfile = platform;
                            break;
                        }
                    }
                    if (selectedQuote) break;
                }
            }

            if (!selectedQuote) {
                const firstPlatform = response.data[0];
                if (firstPlatform.spreadProfilePrices && firstPlatform.spreadProfilePrices.length > 0) {
                    selectedQuote = firstPlatform.spreadProfilePrices[0];
                    selectedProfile = firstPlatform;
                }
            }

            if (selectedQuote && selectedProfile) {
                const askPrice = selectedQuote.ask;
                const bidPrice = selectedQuote.bid;
                const pricePerGram = askPrice / 31.1035;

                goldPriceData = {
                    askPrice: Number(askPrice.toFixed(2)),
                    bidPrice: Number(bidPrice.toFixed(2)),
                    pricePerGram: Number(pricePerGram.toFixed(2)),
                    askSpread: selectedQuote.askSpread,
                    bidSpread: selectedQuote.bidSpread,
                    spreadProfile: selectedQuote.spreadProfile,
                    platform: selectedProfile.topo.platform,
                    server: selectedProfile.topo.server,
                    lastUpdated: new Date().toISOString(),
                    timestamp: selectedProfile.ts
                };
            }
        }
    } catch (error) {
        console.error('Error fetching gold price:', error.message);
        // Use fallback data if no current data exists
        if (goldPriceData.pricePerGram === 0) {
            goldPriceData = {
                askPrice: 2020,
                bidPrice: 2015,
                pricePerGram: 65.0, // Fallback price per gram
                askSpread: 17,
                bidSpread: 17,
                spreadProfile: 'fallback',
                platform: 'Fallback',
                server: 'Local',
                lastUpdated: new Date().toISOString(),
                timestamp: Date.now()
            };
        }
    }
}


const loadProducts = () => {
    try {
        const productsPath = path.join(__dirname, 'data', 'products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        return JSON.parse(productsData);
    } catch (error) {
        return [];
    }
};

const calculatePrice = (popularityScore, weight) => {
    return Number(((popularityScore + 1) * weight * goldPriceData.pricePerGram).toFixed(2));
};

const parseNumericParam = (param, defaultValue, min = null, max = null) => {
    if (!param) return defaultValue;
    const parsed = parseFloat(param);
    if (isNaN(parsed)) return defaultValue;
    if (min !== null && parsed < min) return min;
    if (max !== null && parsed > max) return max;
    return parsed;
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

app.get('/api/products', (req, res) => {
    try {
        const products = loadProducts();

        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No products found',
                error: 'NO_PRODUCTS'
            });
        }

        const {
            minPrice,
            maxPrice,
            minPopularity,
            maxPopularity
        } = req.query;

        const filters = {
            minPrice: parseNumericParam(minPrice, 0, 0),
            maxPrice: parseNumericParam(maxPrice, Infinity, 0),
            minPopularity: parseNumericParam(minPopularity, 0, 0, 1),
            maxPopularity: parseNumericParam(maxPopularity, 1, 0, 1)
        };

        if (filters.minPrice > filters.maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price range: minPrice cannot be greater than maxPrice',
                error: 'INVALID_PRICE_RANGE'
            });
        }

        if (filters.minPopularity > filters.maxPopularity) {
            return res.status(400).json({
                success: false,
                message: 'Invalid popularity range: minPopularity cannot be greater than maxPopularity',
                error: 'INVALID_POPULARITY_RANGE'
            });
        }

        let enrichedProducts = products.map(product => ({
            ...product,
            price: calculatePrice(product.popularityScore, product.weight),
            popularityScoreOutOf5: Number((product.popularityScore * 5).toFixed(1)),
            pricePerGram: Number((calculatePrice(product.popularityScore, product.weight) / product.weight).toFixed(2))
        }));

        let filteredProducts = applyFilters(enrichedProducts, filters);

        res.json({
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
            goldPrice: goldPriceData,
            warning: goldPriceData.spreadProfile === 'fallback' ? 'Using fallback gold price data' : undefined
        });
    } catch (error) {
        console.error('Error in /api/products:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        goldPrice: goldPriceData.lastUpdated ? 'Available' : 'Loading...',
        environment: process.env.NODE_ENV || 'development'
    });
});

// Only start server in development mode
// In production (Vercel), this will be handled by the serverless function
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Export for Vercel
module.exports = app;
