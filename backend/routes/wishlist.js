const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management endpoints
 */

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get wishlist items
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Wishlist items }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, wishlistController.getWishlist);

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add item to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId: { type: string }
 *     responses:
 *       200: { description: Item added to wishlist }
 *       401: { description: Unauthorized }
 */
router.post('/add', authenticate, wishlistController.addItem);

/**
 * @swagger
 * /wishlist/remove/{productId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item removed from wishlist }
 *       401: { description: Unauthorized }
 */
router.delete('/remove/:productId', authenticate, wishlistController.removeItem);

module.exports = router; 