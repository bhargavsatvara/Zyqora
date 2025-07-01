/**
 * @swagger
 * tags:
 *   name: Colors
 *   description: Color listing
 */

/**
 * @swagger
 * /colors:
 *   get:
 *     summary: List all colors
 *     tags: [Colors]
 *     responses:
 *       200: { description: List of colors }
 */

const express = require('express');
const router = express.Router();
const colorController = require('../controllers/colorController');

router.get('/', colorController.getAllColors);

module.exports = router; 