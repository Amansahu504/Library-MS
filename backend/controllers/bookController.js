const Book = require('../models/Book');

// Add a new book
exports.addBook = async (req, res) => {
  try {
    console.log('Received book data:', req.body);
    
    const { title, author, isbn, category, availableCount } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          title: !title ? 'Title is required' : null,
          author: !author ? 'Author is required' : null,
          isbn: !isbn ? 'ISBN is required' : null,
          category: !category ? 'Category is required' : null
        }
      });
    }

    // Check if book with same ISBN exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    // Create new book
    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim(),
      category: category.trim(),
      availableCount: availableCount || 1
    });

    console.log('Attempting to save book:', book);
    const savedBook = await book.save();
    console.log('Book saved successfully:', savedBook);
    
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Detailed error adding book:', error);
    res.status(500).json({ 
      message: 'Error adding book',
      error: error.message,
      details: error.stack
    });
  }
};

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ message: 'Error getting books', error: error.message });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ message: 'Error getting book', error: error.message });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, category, availableCount } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !category) {
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          title: !title ? 'Title is required' : null,
          author: !author ? 'Author is required' : null,
          isbn: !isbn ? 'ISBN is required' : null,
          category: !category ? 'Category is required' : null
        }
      });
    }

    // Validate availableCount
    if (availableCount !== undefined && (isNaN(availableCount) || availableCount < 0)) {
      return res.status(400).json({ message: 'Available count must be a non-negative number' });
    }

    // Check if ISBN is being changed and if new ISBN already exists
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.isbn !== isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'A book with this ISBN already exists' });
      }
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author.trim(),
        isbn: isbn.trim(),
        category: category.trim(),
        availableCount: availableCount !== undefined ? parseInt(availableCount) : book.availableCount
      },
      { new: true, runValidators: true }
    );

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
}; 