const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management endpoints
 */

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of coupons }
 *       401: { description: Unauthorized }
 */
router.get('/', authenticate, couponController.getAllCoupons);

// /**
//  * @swagger
//  * /coupons/{id}:
//  *   get:
//  *     summary: Get coupon by ID
//  *     tags: [Coupons]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Coupon details }
//  *       401: { description: Unauthorized }
//  *       404: { description: Coupon not found }
//  */
// router.get('/:id', authenticate, couponController.getCouponById);

// /**
//  * @swagger
//  * /coupons:
//  *   post:
//  *     summary: Create new coupon
//  *     tags: [Coupons]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [code, discount, type, startDate, endDate]
//  *             properties:
//  *               code: { type: string }
//  *               discount: { type: number }
//  *               type: { type: string, enum: ['percentage', 'fixed'] }
//  *               startDate: { type: string, format: date-time }
//  *               endDate: { type: string, format: date-time }
//  *               minPurchase: { type: number }
//  *               maxDiscount: { type: number }
//  *               usageLimit: { type: number }
//  *     responses:
//  *       201: { description: Coupon created successfully }
//  *       401: { description: Unauthorized }
//  */
// router.post('/', authenticate, couponController.createCoupon);

// /**
//  * @swagger
//  * /coupons/{id}:
//  *   put:
//  *     summary: Update coupon
//  *     tags: [Coupons]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               code: { type: string }
//  *               discount: { type: number }
//  *               type: { type: string, enum: ['percentage', 'fixed'] }
//  *               startDate: { type: string, format: date-time }
//  *               endDate: { type: string, format: date-time }
//  *               minPurchase: { type: number }
//  *               maxDiscount: { type: number }
//  *               usageLimit: { type: number }
//  *     responses:
//  *       200: { description: Coupon updated successfully }
//  *       401: { description: Unauthorized }
//  *       404: { description: Coupon not found }
//  */
// router.put('/:id', authenticate, couponController.updateCoupon);

// /**
//  * @swagger
//  * /coupons/{id}:
//  *   delete:
//  *     summary: Delete coupon
//  *     tags: [Coupons]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Coupon deleted successfully }
//  *       401: { description: Unauthorized }
//  *       404: { description: Coupon not found }
//  */
// router.delete('/:id', authenticate, couponController.deleteCoupon);

// /**
//  * @swagger
//  * /coupons/validate/{code}:
//  *   get:
//  *     summary: Validate coupon code
//  *     tags: [Coupons]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: code
//  *         required: true
//  *         schema: { type: string }
//  *     responses:
//  *       200: { description: Coupon is valid }
//  *       400: { description: Invalid coupon }
//  *       401: { description: Unauthorized }
//  */
// router.get('/validate/:code', authenticate, couponController.validateCoupon);

module.exports = router; 