const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Only admins can create, update, or delete tasks
router.post('/', authMiddleware(['admin']), taskController.createTask);
router.get('/user/:userId', authMiddleware(['admin', 'user']), taskController.getTasksByUserId);
router.get('/', authMiddleware(['admin']), taskController.getAllTasks);
router.put('/:id', authMiddleware(['admin']), taskController.updateTask);
router.delete('/:id', authMiddleware(['admin']), taskController.deleteTask);

module.exports = router;