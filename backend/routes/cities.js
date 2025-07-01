const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: City management endpoints
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags: [Cities]
 *     parameters:
 *       - in: query
 *         name: stateId
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of cities }
 */
router.get('/', cityController.getAllCities);

/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get city by ID
 *     tags: [Cities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: City details }
 *       404: { description: City not found }
 */
router.get('/:id', cityController.getCityById);

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create new city
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, stateId]
 *             properties:
 *               name: { type: string }
 *               stateId: { type: string }
 *               code: { type: string }
 *     responses:
 *       201: { description: City created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, cityController.createCity);

/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update city
 *     tags: [Cities]
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
 *               stateId: { type: string }
 *               code: { type: string }
 *     responses:
 *       200: { description: City updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: City not found }
 */
router.put('/:id', authenticate, cityController.updateCity);

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete city
 *     tags: [Cities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: City deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: City not found }
 */
router.delete('/:id', authenticate, cityController.deleteCity);

module.exports = router; 