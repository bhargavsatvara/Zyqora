const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Coupon = require('../models/coupon');

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management endpoints
 */


/**
 * @swagger
 * /coupons/available:
 *   get:
 *     summary: Get available coupons for checkout (public endpoint)
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: orderTotal
 *         schema: { type: number, default: 0 }
 *         description: Order total amount for filtering coupons
 *     responses:
 *       200: { description: List of available coupons }
 *       500: { description: Server error }
 */
router.get('/available', couponController.getAvailableCoupons);


/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons with pagination and filtering
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by coupon code
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, expired] }
 *         description: Filter by status
 *     responses:
 *       200: { description: List of coupons with pagination }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, authorizeAdmin, couponController.getAllCoupons);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Coupon details }
 *       401: { description: Unauthorized }
 *       404: { description: Coupon not found }
 */
router.get('/:id', authenticate, authorizeAdmin, couponController.getCouponById);

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, discountAmount]
 *             properties:
 *               code: { type: string, description: 'Coupon code' }
 *               discountAmount: { type: number, description: 'Discount amount' }
 *               minimumOrderAmount: { type: number, default: 0, description: 'Minimum order amount required' }
 *               expiryDate: { type: string, format: date-time, description: 'Expiry date' }
 *               isActive: { type: boolean, default: true, description: 'Whether coupon is active' }
 *               usageLimit: { type: number, description: 'Maximum number of times coupon can be used' }
 *     responses:
 *       201: { description: Coupon created successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, authorizeAdmin, couponController.createCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update coupon
 *     tags: [Coupons]
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
 *               code: { type: string, description: 'Coupon code' }
 *               discountAmount: { type: number, description: 'Discount amount' }
 *               minimumOrderAmount: { type: number, description: 'Minimum order amount required' }
 *               expiryDate: { type: string, format: date-time, description: 'Expiry date' }
 *               isActive: { type: boolean, description: 'Whether coupon is active' }
 *               usageLimit: { type: number, description: 'Maximum number of times coupon can be used' }
 *     responses:
 *       200: { description: Coupon updated successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       404: { description: Coupon not found }
 */
router.put('/:id', authenticate, authorizeAdmin, couponController.updateCoupon);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Coupon deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Coupon not found }
 */
router.delete('/:id', authenticate, authorizeAdmin, couponController.deleteCoupon);

/**
 * @swagger
 * /coupons/validate/{code}:
 *   get:
 *     summary: Validate coupon code
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: orderTotal
 *         schema: { type: number, default: 0 }
 *         description: Order total amount for validation
 *     responses:
 *       200: { description: Coupon is valid }
 *       400: { description: Invalid coupon }
 *       401: { description: Unauthorized }
 */
router.get('/validate/:code', authenticate, couponController.validateCoupon);

/**
 * @swagger
 * /coupons/apply:
 *   post:
 *     summary: Apply coupon to order
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code: { type: string, description: 'Coupon code' }
 *               orderTotal: { type: number, description: 'Order total amount' }
 *     responses:
 *       200: { description: Coupon applied successfully }
 *       400: { description: Invalid coupon or validation failed }
 *       401: { description: Unauthorized }
 */
router.post('/apply', authenticate, couponController.applyCoupon);

module.exports = router; 