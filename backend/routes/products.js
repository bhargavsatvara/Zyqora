const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const upload = require('../utils/multer');
const path = require('path');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination and search
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search term for product name, description, or SKU
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *       - in: query
 *         name: category_id
 *         schema: { type: string }
 *         description: Filter by category ID
 *       - in: query
 *         name: brand_id
 *         schema: { type: string }
 *         description: Filter by brand ID
 *       - in: query
 *         name: min_price
 *         schema: { type: number }
 *         description: Minimum price filter
 *       - in: query
 *         name: max_price
 *         schema: { type: number }
 *         description: Maximum price filter
 *     responses:
 *       200: { description: List of products with pagination }
 */
router.get('/', productController.getAllProducts);



/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Search results }
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200: { description: Featured products }
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get single product details
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product details }
 *       404: { description: Product not found }
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               category_id: { type: string }
 *               brand_id: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               stock_qty: { type: number }
 *     responses:
 *       201: { description: Product created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, upload.single('image'), productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               sku: { type: string }
 *               category_id: { type: string }
 *               brand_id: { type: string }
 *               price: { type: number }
 *               description: { type: string }
 *               stock_qty: { type: number }
 *     responses:
 *       200: { description: Product updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Product not found }
 */
router.put('/:id', authenticate, upload.single('image'), productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Product not found }
 */
router.delete('/:id', authenticate, productController.deleteProduct);

/**
 * @swagger
 * /products/bulk-delete:
 *   post:
 *     summary: Bulk delete products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productIds]
 *             properties:
 *               productIds: 
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200: { description: Products deleted successfully }
 *       401: { description: Unauthorized }
 */
router.post('/bulk-delete', authenticate, productController.bulkDeleteProducts);

module.exports = router; 