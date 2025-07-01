const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: Material management endpoints
 */

/**
 * @swagger
 * /materials:
 *   get:
 *     summary: Get all materials
 *     tags: [Materials]
 *     responses:
 *       200: { description: List of materials }
 */
router.get('/', materialController.getAllMaterials);

// /**
//  * @swagger
//  * /materials/{id}:
//  *   get:
//  *     summary: Get material by ID
//  *     tags: [Materials]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Material details }
//  *       404: { description: Material not found }
//  */
// router.get('/:id', materialController.getMaterialById);

// /**
//  * @swagger
//  * /materials:
//  *   post:
//  *     summary: Create new material
//  *     tags: [Materials]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [name]
//  *             properties:
//  *               name: { type: string }
//  *               description: { type: string }
//  *               properties: { type: object }
//  *     responses:
//  *       201: { description: Material created successfully }
//  *       401: { description: Unauthorized }
//  */
// router.post('/', authenticate, materialController.createMaterial);

// /**
//  * @swagger
//  * /materials/{id}:
//  *   put:
//  *     summary: Update material
//  *     tags: [Materials]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name: { type: string }
//  *               description: { type: string }
//  *               properties: { type: object }
//  *     responses:
//  *       200: { description: Material updated successfully }
//  *       401: { description: Unauthorized }
//  *       404: { description: Material not found }
//  */
// router.put('/:id', authenticate, materialController.updateMaterial);

// /**
//  * @swagger
//  * /materials/{id}:
//  *   delete:
//  *     summary: Delete material
//  *     tags: [Materials]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Material deleted successfully }
//  *       401: { description: Unauthorized }
//  *       404: { description: Material not found }
//  */
// router.delete('/:id', authenticate, materialController.deleteMaterial);

module.exports = router; 