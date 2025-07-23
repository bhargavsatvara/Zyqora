const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const addressController = require('../controllers/addressController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and settings management
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User profile data }
 *       401: { description: Unauthorized }
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200: { description: Profile updated successfully }
 *       401: { description: Unauthorized }
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @swagger
 * /user/settings:
 *   get:
 *     summary: Get user settings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: User settings }
 *       401: { description: Unauthorized }
 */
router.get('/settings', authenticate, userController.getSettings);

/**
 * @swagger
 * /user/settings:
 *   put:
 *     summary: Update user settings
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotifications: { type: boolean }
 *               smsNotifications: { type: boolean }
 *     responses:
 *       200: { description: Settings updated successfully }
 *       401: { description: Unauthorized }
 */
router.put('/settings', authenticate, userController.updateSettings);

/**
 * @swagger
 * /user/password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200: { description: Password updated successfully }
 *       400: { description: Bad request }
 *       401: { description: Unauthorized }
 */
router.put('/password', authenticate, userController.updatePassword);

/**
 * @swagger
 * /user/address:
 *   get:
 *     summary: Get user addresses
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of user addresses }
 *       401: { description: Unauthorized }
 */
router.get('/address', authenticate, addressController.getAllAddresses);

/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: Add new address
 *     tags: [User]
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
 *       201: { description: Address added successfully }
 *       401: { description: Unauthorized }
 */
router.post('/address', authenticate, addressController.createAddress);

/**
 * @swagger
 * /user/address/{id}:
 *   put:
 *     summary: Update address
 *     tags: [User]
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
 */
router.put('/address/:id', authenticate, addressController.updateAddress);

/**
 * @swagger
 * /user/address/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [User]
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
 */
router.delete('/address/:id', authenticate, addressController.deleteAddress);

module.exports = router; 