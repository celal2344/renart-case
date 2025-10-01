class GoldPrice {
    constructor() {
        this.data = {
            askPrice: 0,
            bidPrice: 0,
            pricePerGram: 0,
            lastUpdated: null,
            askSpread: 0,
            bidSpread: 0,
            spreadProfile: null,
            platform: null,
            server: null,
            timestamp: null
        };
    }

    getCurrentData() {
        return { ...this.data };
    }

    updateData(newData) {
        this.data = {
            ...this.data,
            ...newData,
            lastUpdated: new Date().toISOString()
        };
    }

    getPricePerGram() {
        return this.data.pricePerGram;
    }

    getSpreadInfo() {
        const spread = this.data.askPrice && this.data.bidPrice ?
            Number((this.data.askPrice - this.data.bidPrice).toFixed(2)) : 0;

        return {
            spread,
            askSpread: this.data.askSpread,
            bidSpread: this.data.bidSpread,
            spreadPercentage: this.data.askPrice > 0 ?
                Number(((spread / this.data.askPrice) * 100).toFixed(3)) : 0
        };
    }

    isDataStale() {
        if (!this.data.lastUpdated) return true;
        const lastUpdate = new Date(this.data.lastUpdated);
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        return lastUpdate < twoHoursAgo;
    }

    setFallbackData() {
        // Updated fallback to reflect more current gold prices (~$124/gram instead of $65)
        // This prevents the "halved price" issue when API fails on Vercel
        this.data = {
            askPrice: 3850,  // Updated from 2020
            bidPrice: 3845,  // Updated from 2015
            pricePerGram: 124, // Updated from 65 to match current market rates
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

module.exports = new GoldPrice();
