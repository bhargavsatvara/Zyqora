const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Sizes
 *   description: Size management endpoints
 */

/**
 * @swagger
 * /sizes:
 *   get:
 *     summary: Get all sizes
 *     tags: [Sizes]
 *     responses:
 *       200: { description: List of sizes }
 */
router.get('/', sizeController.getAllSizes);

/**
 * @swagger
 * /sizes/{id}:
 *   get:
 *     summary: Get size by ID
 *     tags: [Sizes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Size details }
 *       404: { description: Size not found }
 */
router.get('/:id', sizeController.getSizeById);

/**
 * @swagger
 * /sizes:
 *   post:
 *     summary: Create new size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category]
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Size created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, sizeController.createSize);

/**
 * @swagger
 * /sizes/{id}:
 *   put:
 *     summary: Update size
 *     tags: [Sizes]
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
 *               category: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Size updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Size not found }
 */
router.put('/:id', authenticate, sizeController.updateSize);

/**
 * @swagger
 * /sizes/{id}:
 *   delete:
 *     summary: Delete size
 *     tags: [Sizes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Size deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Size not found }
 */
router.delete('/:id', authenticate, sizeController.deleteSize);

module.exports = router; 