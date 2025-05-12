const Student = require('../models/Student');
const Book = require('../models/Book');

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('issuedBooks.book', 'title author isbn category');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get student by ID with issued books
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate({
        path: 'issuedBooks.book',
        select: 'title author isbn category availableCount'
      });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error: error.message });
  }
};

// Add new student
exports.addStudent = async (req, res) => {
  const { name, no, rollNo, department, batch } = req.body;
  try {
    const existingRollNo = await Student.findOne({ rollNo });
    if (existingRollNo) return res.status(400).json({ message: 'Roll number already exists' });
    
    const existingNo = await Student.findOne({ no });
    if (existingNo) return res.status(400).json({ message: 'Student number already exists' });

    const student = new Student({ name, no, rollNo, department, batch });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  const { name, no, rollNo, department, batch } = req.body;
  try {
    // Check if rollNo is being changed and if it already exists
    if (rollNo) {
      const existingRollNo = await Student.findOne({ rollNo, _id: { $ne: req.params.id } });
      if (existingRollNo) {
        return res.status(400).json({ message: 'Roll number already exists' });
      }
    }

    // Check if no is being changed and if it already exists
    if (no) {
      const existingNo = await Student.findOne({ no, _id: { $ne: req.params.id } });
      if (existingNo) {
        return res.status(400).json({ message: 'Student number already exists' });
      }
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, no, rollNo, department, batch },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add book to student
exports.addBookToStudent = async (req, res) => {
  try {
    const { bookId, issueDate } = req.body;
    const studentId = req.params.id;

    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if book exists and has available copies
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCount <= 0) {
      return res.status(400).json({ message: 'No copies of this book are available' });
    }

    // Check if book is already issued to the student and not returned
    const isBookIssued = student.issuedBooks.some(
      issuedBook => issuedBook.book.toString() === bookId && !issuedBook.returnDate
    );
    if (isBookIssued) {
      return res.status(400).json({ message: 'Book is already issued to this student' });
    }

    // Decrease available count
    book.availableCount -= 1;
    await book.save();

    // Add book to student's issued books
    student.issuedBooks.push({
      book: bookId,
      issueDate: new Date(issueDate || Date.now())
    });

    await student.save();
    res.json({ message: 'Book added successfully', student });
  } catch (error) {
    console.error('Error adding book to student:', error);
    res.status(500).json({ message: 'Error adding book', error: error.message });
  }
};

// Return book from student
exports.returnBook = async (req, res) => {
  try {
    const { id, bookId } = req.params;
    const { returnDate } = req.body;

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find the book in student's issued books
    const issuedBook = student.issuedBooks.find(
      issuedBook => issuedBook.book.toString() === bookId && !issuedBook.returnDate
    );

    if (!issuedBook) {
      return res.status(404).json({ message: 'Book not found in student\'s issued books or already returned' });
    }

    // Update the return date
    issuedBook.returnDate = new Date(returnDate || Date.now());
    await student.save();

    // Increase available count
    const book = await Book.findById(bookId);
    if (book) {
      book.availableCount += 1;
      await book.save();
    }

    res.json({ message: 'Book returned successfully', student });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Error returning book', error: error.message });
  }
}; 