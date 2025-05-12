const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

// Debug log to check imports
console.log('Student Controller:', studentController);

const {
  getStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  addBookToStudent,
  returnBook
} = studentController;

// Get all students
router.get('/', authorize('admin', 'employee'), getStudents);

// Get student by ID
router.get('/:id', authorize('admin', 'employee'), getStudentById);

// Add new student
router.post('/', authorize('admin'), addStudent);

// Update student
router.put('/:id', authorize('admin'), updateStudent);

// Delete student
router.delete('/:id', authorize('admin'), deleteStudent);

// Add book to student
router.post('/:id/books', authorize('admin', 'employee'), addBookToStudent);

// Return book from student
router.put('/:id/books/:bookId/return', authorize('admin', 'employee'), returnBook);

module.exports = router; 