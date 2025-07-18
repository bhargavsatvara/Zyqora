const express = require('express');
const router = express.Router();
const productMaterialController = require('../controllers/productMaterialController');

router.post('/', productMaterialController.createProductMaterial);
router.get('/', productMaterialController.getProductMaterials);
router.get('/:id', productMaterialController.getProductMaterial);
router.put('/:id', productMaterialController.updateProductMaterial);
router.delete('/:id', productMaterialController.deleteProductMaterial);

module.exports = router; 