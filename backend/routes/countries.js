const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management endpoints
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200: { description: List of countries }
 */
router.get('/', countryController.getAllCountries);

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     summary: Get country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Country details }
 *       404: { description: Country not found }
 */
router.get('/:id', countryController.getCountryById);

/**
 * @swagger
 * /countries:
 *   post:
 *     summary: Create new country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               phoneCode: { type: string }
 *     responses:
 *       201: { description: Country created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, countryController.createCountry);

/**
 * @swagger
 * /countries/{id}:
 *   put:
 *     summary: Update country
 *     tags: [Countries]
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
 *               code: { type: string }
 *               phoneCode: { type: string }
 *     responses:
 *       200: { description: Country updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Country not found }
 */
router.put('/:id', authenticate, countryController.updateCountry);

/**
 * @swagger
 * /countries/{id}:
 *   delete:
 *     summary: Delete country
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Country deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Country not found }
 */
router.delete('/:id', authenticate, countryController.deleteCountry);

module.exports = router; 