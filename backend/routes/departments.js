const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { authenticate } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200: { description: List of departments }
 */
router.get('/', departmentController.getAllDepartments);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Department details }
 *       404: { description: Department not found }
 */
router.get('/:id', departmentController.getDepartmentById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       201: { description: Department created successfully }
 *       401: { description: Unauthorized }
 */
router.post('/', authenticate, departmentController.createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department
 *     tags: [Departments]
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
 *               name: { type: string }
 *               description: { type: string }
 *               image: { type: string }
 *     responses:
 *       200: { description: Department updated successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Department not found }
 */
router.put('/:id', authenticate, departmentController.updateDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Department deleted successfully }
 *       401: { description: Unauthorized }
 *       404: { description: Department not found }
 */
router.delete('/:id', authenticate, departmentController.deleteDepartment);

module.exports = router; 