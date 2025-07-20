const express = require('express');
const router = express.Router();
const sizeChartController = require('../controllers/sizeChartController');
const { authenticate } = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authenticate);

// GET /api/size-charts - Get all size charts
router.get('/', sizeChartController.getSizeCharts);

// GET /api/size-charts/:id - Get a single size chart
router.get('/:id', sizeChartController.getSizeChart);

// POST /api/size-charts - Create a new size chart
router.post('/', sizeChartController.createSizeChart);

// PUT /api/size-charts/:id - Update a size chart
router.put('/:id', sizeChartController.updateSizeChart);

// DELETE /api/size-charts/:id - Delete a size chart
router.delete('/:id', sizeChartController.deleteSizeChart);

// POST /api/size-charts/bulk-delete - Bulk delete size charts
router.post('/bulk-delete', sizeChartController.bulkDeleteSizeCharts);

module.exports = router; 