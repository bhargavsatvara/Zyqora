const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuthenticate } = require('../middleware/auth');

// Allow both guests and logged-in users
router.use(optionalAuthenticate);

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
 *     responses:
 *       200: { description: Cart items }
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, name, price, quantity]
 *             properties:
 *               product_id: { type: string }
 *               name: { type: string }
 *               price: { type: number }
 *               image: { type: string }
 *               quantity: { type: number }
 *               color: { type: string }
 *               size: { type: string }
 *               stock_qty: { type: number }
 *     responses:
 *       200: { description: Item added to cart }
 *       400: { description: Bad request }
 */
router.post('/add', cartController.addItem);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
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
 */
router.put('/update', cartController.updateItem);

/**
 * @swagger
 * /cart/remove:
 *   post:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, size, color]
 *             properties:
 *               product_id: { type: string }
 *               size: { type: string }
 *               color: { type: string }
 *     responses:
 *       200: { description: Item removed from cart }
 */
router.post('/remove', cartController.removeItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear cart
 *     tags: [Cart]
 *     responses:
 *       200: { description: Cart cleared }
 */
router.delete('/clear', cartController.clearCart);

module.exports = router; 