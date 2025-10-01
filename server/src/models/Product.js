const fs = require('fs');
const path = require('path');

class Product {
    constructor() {
        this.dataPath = path.join(__dirname, '../../data/products.json');
    }

    getAll() {
        try {
            const productsData = fs.readFileSync(this.dataPath, 'utf8');
            return JSON.parse(productsData);
        } catch (error) {
            return [];
        }
    }
}

module.exports = new Product();
