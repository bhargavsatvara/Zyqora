const express = require('express');
const router = express.Router();
const productSizeController = require('../controllers/productSizeController');

router.post('/', productSizeController.createProductSize);
router.get('/', productSizeController.getProductSizes);
router.get('/:id', productSizeController.getProductSize);
router.put('/:id', productSizeController.updateProductSize);
router.delete('/:id', productSizeController.deleteProductSize);

module.exports = router; 