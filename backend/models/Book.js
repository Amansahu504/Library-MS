const mongoose = require('mongoose');

// Drop any existing indexes before creating the schema
mongoose.connection.on('connected', async () => {
  try {
    const db = mongoose.connection.db;
    const booksCollection = db.collection('books');
    await booksCollection.dropIndexes();
    console.log('Dropped all indexes from books collection');
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }
});

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  author: { 
    type: String, 
    required: [true, 'Author is required'],
    trim: true,
    minlength: [1, 'Author cannot be empty']
  },
  isbn: { 
    type: String, 
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    minlength: [1, 'ISBN cannot be empty']
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
    minlength: [1, 'Category cannot be empty']
  },
  availableCount: { 
    type: Number, 
    required: true, 
    default: 1, 
    min: [0, 'Available count cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Available count must be an integer'
    }
  }
}, { 
  timestamps: true,
  // Explicitly disable _id to prevent any ID-related issues
  _id: true,
  // Remove any automatic index creation
  autoIndex: false
});

// Only create the ISBN index
bookSchema.index({ isbn: 1 }, { unique: true });

// Add pre-save middleware to ensure data is properly formatted
bookSchema.pre('save', function(next) {
  // Ensure availableCount is a number
  if (this.availableCount !== undefined) {
    this.availableCount = parseInt(this.availableCount);
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema); 