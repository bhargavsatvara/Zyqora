/**
 * @swagger
 * tags:
 *   name: Colors
 *   description: Color management endpoints
 */

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: Get all colors
 *     tags: [Colors]
 *     responses:
 *       200: { description: List of colors }
 */

const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');
const { authenticate } = require('../middleware/auth');

router.get('/', colorController.getAllColors);

/**
 * @swagger
 * /colors/{id}:
 *   get:
 *     summary: Get color by ID
 *     tags: [Colors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Color details }
 *       404: { description: Color not found }
 */
router.get('/:id', colorController.getColorById);

/**
 * @swagger
 * /colors:
 *   post:
 *     summary: Create new color
 *     tags: [Colors]
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
 *               hex_code: { type: string }
 *     responses:
 *       201: { description: Color created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', colorController.createColor);

/**
 * @swagger
 * /colors/{id}:
 *   put:
 *     summary: Update color
 *     tags: [Colors]
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
 *               hex_code: { type: string }
 *     responses:
 *       200: { description: Color updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Color not found }
 */
router.put('/:id', colorController.updateColor);

/**
 * @swagger
 * /colors/{id}:
 *   delete:
 *     summary: Delete color
 *     tags: [Colors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Color deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Color not found }
 */
router.delete('/:id', colorController.deleteColor);

module.exports = router; 