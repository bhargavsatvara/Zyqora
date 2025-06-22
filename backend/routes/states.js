/**
 * @swagger
 * tags:
 *   name: States
 *   description: State management endpoints
 */

/**
 * @swagger
 * /states:
 *   get:
 *     summary: Get all states
 *     tags: [States]
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of states }
 */

const express = require('express');
const router = express.Router();
const stateController = require('../controllers/stateController');
const { authenticate } = require('../middleware/auth');

router.get('/', stateController.getAllStates);

/**
 * @swagger
 * /states/{id}:
 *   get:
 *     summary: Get state by ID
 *     tags: [States]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: State details }
 *       404: { description: State not found }
 */
router.get('/:id', stateController.getStateById);

/**
 * @swagger
 * /states:
 *   post:
 *     summary: Create new state
 *     tags: [States]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, countryId]
 *             properties:
 *               name: { type: string }
 *               countryId: { type: string }
 *               code: { type: string }
 *     responses:
 *       201: { description: State created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, stateController.createState);

/**
 * @swagger
 * /states/{id}:
 *   put:
 *     summary: Update state
 *     tags: [States]
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
 *               countryId: { type: string }
 *               code: { type: string }
 *     responses:
 *       200: { description: State updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: State not found }
 */
router.put('/:id', authenticate, stateController.updateState);

/**
 * @swagger
 * /states/{id}:
 *   delete:
 *     summary: Delete state
 *     tags: [States]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: State deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: State not found }
 */
router.delete('/:id', authenticate, stateController.deleteState);

module.exports = router; 