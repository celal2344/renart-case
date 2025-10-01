const axios = require('axios');
const config = require('../config');
const GoldPrice = require('../models/GoldPrice');

class GoldPriceService {
    constructor() {
        this.goldPrice = GoldPrice;
        this.isUpdating = false;
    }

    async fetchGoldPrice() {
        if (this.isUpdating) {
            return;
        }

        this.isUpdating = true;

        try {
            const response = await axios.get(config.goldPrice.apiUrl, {
                timeout: 5000  // Reduced timeout for Vercel compatibility
            });

            if (response.data && response.data.length > 0) {
                const selectedQuote = this._selectBestQuote(response.data);

                if (selectedQuote.quote && selectedQuote.platform) {
                    const priceData = this._calculatePriceData(selectedQuote.quote, selectedQuote.platform);
                    this.goldPrice.updateData(priceData);
                    console.log(`Gold price updated successfully: ${priceData.pricePerGram}/gram`);
                } else {
                    throw new Error('No valid quote found in API response');
                }
            } else {
                throw new Error('Invalid API response format');
            }
        } catch (error) {
            console.error('Gold price API failed:', error.message);
            throw new Error(`Unable to fetch current gold prices: ${error.message}`);
        } finally {
            this.isUpdating = false;
        }
    }

    _selectBestQuote(data) {
        const profilePriority = ['standard', 'premium', 'prime', 'elite'];

        for (const platform of data) {
            if (platform.spreadProfilePrices && platform.spreadProfilePrices.length > 0) {
                for (const priorityProfile of profilePriority) {
                    const profile = platform.spreadProfilePrices.find(p =>
                        p.spreadProfile === priorityProfile
                    );
                    if (profile) {
                        return { quote: profile, platform };
                    }
                }

                return {
                    quote: platform.spreadProfilePrices[0],
                    platform
                };
            }
        }

        return { quote: null, platform: null };
    }

    _calculatePriceData(quote, platform) {
        const askPrice = quote.ask;
        const bidPrice = quote.bid;
        const pricePerGram = askPrice / 31.1035;

        return {
            askPrice: Number(askPrice.toFixed(2)),
            bidPrice: Number(bidPrice.toFixed(2)),
            pricePerGram: Number(pricePerGram.toFixed(2)),
            askSpread: quote.askSpread,
            bidSpread: quote.bidSpread,
            spreadProfile: quote.spreadProfile,
            platform: platform.topo.platform,
            server: platform.topo.server,
            timestamp: platform.ts
        };
    }

    getCurrentGoldPrice() {
        return this.goldPrice.getCurrentData();
    }
}

module.exports = new GoldPriceService();
