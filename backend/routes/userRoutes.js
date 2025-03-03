const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Only admins can access these routes
router.get('/', authMiddleware(['admin']), userController.getAllUsers);
router.get('/:id', authMiddleware(['admin']), userController.getUserById);
router.put('/:id', authMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware(['admin']), userController.deleteUser);

module.exports = router;