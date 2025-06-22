const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Address management endpoints
 */

/**
 * @swagger
 * /addresses:
 *   get:
 *     summary: Get all addresses
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of addresses }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, addressController.getAllAddresses);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Address details }
 *       401: { description: Unauthorized }
 *       404: { description: Address not found }
 */
router.get('/:id', authenticate, addressController.getAddressById);

/**
 * @swagger
 * /addresses:
 *   post:
 *     summary: Create new address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [street, city, state, country, zipCode]
 *             properties:
 *               street: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               country: { type: string }
 *               zipCode: { type: string }
 *               isDefault: { type: boolean }
 *     responses:
 *       201: { description: Address created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, addressController.createAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   put:
 *     summary: Update address
 *     tags: [Addresses]
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
 *               street: { type: string }
 *               city: { type: string }
 *               state: { type: string }
 *               country: { type: string }
 *               zipCode: { type: string }
 *               isDefault: { type: boolean }
 *     responses:
 *       200: { description: Address updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Address not found }
 */
router.put('/:id', authenticate, addressController.updateAddress);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Addresses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Address deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Address not found }
 */
router.delete('/:id', authenticate, addressController.deleteAddress);

module.exports = router; 