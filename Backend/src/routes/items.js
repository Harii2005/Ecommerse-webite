const express = require('express');
const {
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
} = require('../controllers/itemController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Admin only routes
router.post('/', authenticateToken, requireAdmin, createItem);
router.put('/:id', authenticateToken, requireAdmin, updateItem);
router.delete('/:id', authenticateToken, requireAdmin, deleteItem);

module.exports = router;
