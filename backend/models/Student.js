const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  no: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  batch: { type: String, required: true },
  issuedBooks: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema); 