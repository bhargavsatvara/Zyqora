const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of orders }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get single order details
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order details }
 *       401: { description: Unauthorized }
 *       404: { description: Order not found }
 */
router.get('/:id', authenticate, orderController.getOrderById);

/**
 * @swagger
 * /orders/create:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress, paymentMethod]
 *             properties:
 *               items: 
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: number }
 *               shippingAddress: { type: string }
 *               paymentMethod: { type: string }
 *               couponCode: { type: string }
 *     responses:
 *       201: { description: Order created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/create', authenticate, orderController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] }
 *     responses:
 *       200: { description: Order status updated }
 *       401: { description: Unauthorized }
 *       404: { description: Order not found }
 */
router.put('/:id/status', authenticate, orderController.updateOrderStatus);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Order cancelled successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Order not found }
 */
router.post('/:id/cancel', authenticate, orderController.cancelOrder);

module.exports = router; 