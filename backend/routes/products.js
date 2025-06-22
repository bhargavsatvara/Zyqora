const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

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
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of products }
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Get product categories
 *     tags: [Products]
 *     responses:
 *       200: { description: List of categories }
 */
router.get('/categories', productController.getCategories);

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
 * /products/filter:
 *   get:
 *     summary: Filter products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *     responses:
 *       200: { description: Filtered products }
 */
router.get('/filter', productController.filterProducts);

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
 * /products/new:
 *   get:
 *     summary: Get new products
 *     tags: [Products]
 *     responses:
 *       200: { description: New products }
 */
router.get('/new', productController.getNewProducts);

/**
 * @swagger
 * /products/sale:
 *   get:
 *     summary: Get products on sale
 *     tags: [Products]
 *     responses:
 *       200: { description: Products on sale }
 */
router.get('/sale', productController.getSaleProducts);

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

module.exports = router; 