const express = require('express');
const CronController = require('../controllers/CronController');
const { asyncHandler } = require('../middleware');

const router = express.Router();

// Cron endpoint for Vercel cron jobs
router.get('/', asyncHandler(CronController.updateGoldPrice));

module.exports = router;
