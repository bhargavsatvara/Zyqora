const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart items
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Cart items }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId: { type: string }
 *               quantity: { type: number }
 *               color: { type: string }
 *               size: { type: string }
 *     responses:
 *       200: { description: Item added to cart }
 *       401: { description: Unauthorized }
 */
router.post('/add', authenticate, cartController.addItem);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [itemId, quantity]
 *             properties:
 *               itemId: { type: string }
 *               quantity: { type: number }
 *     responses:
 *       200: { description: Cart item updated }
 *       401: { description: Unauthorized }
 */
router.put('/update', authenticate, cartController.updateItem);

/**
 * @swagger
 * /cart/remove/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Item removed from cart }
 *       401: { description: Unauthorized }
 */
router.delete('/remove/:itemId', authenticate, cartController.removeItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Cart cleared }
 *       401: { description: Unauthorized }
 */
router.delete('/clear', authenticate, cartController.clearCart);

module.exports = router; 