// routes/order.js

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     summary: Admin – Get all orders with user info and items
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filter by Order ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (pending, processing, etc.)
 *     responses:
 *       200:
 *         description: Paginated list of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/admin',
  authenticate,
  authorizeAdmin,
  orderController.getAllOrdersAdmin
);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for current user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticate,
  orderController.getAllOrders
);

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
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id',
  authenticate,
  orderController.getOrderById
);

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
 *             required:
 *               - billingAddress
 *               - cartItems
 *               - totalAmount
 *             properties:
 *               billingAddress:
 *                 type: object
 *               cartItems:
 *                 type: array
 *               totalAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/create',
  authenticate,
  orderController.createOrder
);

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
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.put(
  '/:id/status',
  authenticate,
  orderController.updateOrderStatus
);

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
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.post(
  '/:id/cancel',
  authenticate,
  orderController.cancelOrder
);

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Initiate Stripe checkout
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalAmount
 *             properties:
 *               totalAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Stripe client secret
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/checkout',
  authenticate,
  orderController.checkout
);

// ------------------
// Admin: Update order status
// ------------------
router.put(
  '/admin/:id/status',
  authenticate,        // verify JWT & populate req.user
  authorizeAdmin,      // ensure req.user.role === 'admin'
  orderController.updateOrderStatusAdmin
);

/**
 * @swagger
 * /orders/{id}/invoice:
 *   get:
 *     summary: Generate invoice for an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Invoice data generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id/invoice',
  authenticate,
  orderController.generateInvoice
);

module.exports = router;
