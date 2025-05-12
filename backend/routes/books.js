const express = require('express');
const router = express.Router();
const { addBook, getBooks, getBookById, updateBook } = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All book operations require authentication
router.use(protect);

router.post('/', authorize('admin', 'employee'), addBook);
router.get('/', authorize('admin', 'employee'), getBooks);
router.get('/:id', authorize('admin', 'employee'), getBookById);
router.put('/:id', authorize('admin', 'employee'), updateBook);

module.exports = router; 