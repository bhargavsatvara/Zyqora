const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management endpoints
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200: { description: List of brands }
 */
router.get('/', brandController.getAllBrands);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Brand details }
 *       404: { description: Brand not found }
 */
router.get('/:id', brandController.getBrandById);

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create new brand
 *     tags: [Brands]
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
 *               description: { type: string }
 *               logo: { type: string }
 *     responses:
 *       201: { description: Brand created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, brandController.createBrand);

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Update brand
 *     tags: [Brands]
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
 *               description: { type: string }
 *               logo: { type: string }
 *     responses:
 *       200: { description: Brand updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Brand not found }
 */
router.put('/:id', authenticate, brandController.updateBrand);

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Delete brand
 *     tags: [Brands]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Brand deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Brand not found }
 */
router.delete('/:id', authenticate, brandController.deleteBrand);

module.exports = router; 