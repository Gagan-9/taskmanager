// taskRoutes.js
const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, taskController.createTask);
router.get('/user/:userId', authMiddleware, taskController.getTasksByUserId);
router.get('/', authMiddleware, taskController.getAllTasks);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;