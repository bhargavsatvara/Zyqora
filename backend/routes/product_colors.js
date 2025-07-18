const express = require('express');
const router = express.Router();
const productColorController = require('../controllers/productColorController');

router.post('/', productColorController.createProductColor);
router.get('/', productColorController.getProductColors);
router.get('/:id', productColorController.getProductColor);
router.put('/:id', productColorController.updateProductColor);
router.delete('/:id', productColorController.deleteProductColor);

module.exports = router; 