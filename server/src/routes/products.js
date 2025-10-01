const express = require('express');
const ProductController = require('../controllers/ProductController');
const { asyncHandler, validateQueryParams } = require('../middleware');

const router = express.Router();

const productQueryParams = [
    'minPrice', 'maxPrice', 'minPopularity', 'maxPopularity'
];

router.get(
    '/',
    validateQueryParams(productQueryParams),
    asyncHandler(ProductController.getProducts)
);

module.exports = router;
