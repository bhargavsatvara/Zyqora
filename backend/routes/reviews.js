const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product review management endpoints
 */

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get product reviews
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of reviews }
 *       404: { description: Product not found }
 */
router.get('/:productId', reviewController.getProductReviews);

/**
 * @swagger
 * /reviews/add:
 *   post:
 *     summary: Add product review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, rating, comment]
 *             properties:
 *               productId: { type: string }
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201: { description: Review added successfully }
 *       401: { description: Unauthorized }
 */
router.post('/add', authenticate, reviewController.addReview);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
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
 *               rating: { type: number, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       200: { description: Review updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Review not found }
 */
router.put('/:id', authenticate, reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Review deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Review not found }
 */
router.delete('/:id', authenticate, reviewController.deleteReview);

module.exports = router; 