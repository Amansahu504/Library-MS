import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const BookOperations = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [returnDate, setReturnDate] = useState('');

  // Fetch student details and available books
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, booksRes] = await Promise.all([
          api.get(`/students/${studentId}`),
          api.get('/books')
        ]);
        setStudent(studentRes.data);
        // Filter out books with zero available count
        const availableBooks = booksRes.data.filter(book => book.availableCount > 0);
        setBooks(availableBooks);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  // Handle book borrowing
  const handleBorrow = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post(`/students/${studentId}/books`, {
        bookId: selectedBook,
        returnDate
      });
      setSuccess('Book borrowed successfully!');
      // Refresh student data and available books
      const [studentRes, booksRes] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get('/books')
      ]);
      setStudent(studentRes.data);
      const availableBooks = booksRes.data.filter(book => book.availableCount > 0);
      setBooks(availableBooks);
      // Reset form
      setSelectedBook('');
      setReturnDate('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error borrowing book');
    }
  };

  // Handle book return
  const handleReturn = async (bookId) => {
    setError('');
    setSuccess('');

    try {
      await api.delete(`/students/${studentId}/books/${bookId}`);
      setSuccess('Book returned successfully!');
      // Refresh student data and available books
      const [studentRes, booksRes] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get('/books')
      ]);
      setStudent(studentRes.data);
      const availableBooks = booksRes.data.filter(book => book.availableCount > 0);
      setBooks(availableBooks);
    } catch (err) {
      setError(err.response?.data?.message || 'Error returning book');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5DC] p-6">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A4A4A]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-6">
      <div className="bg-[#4A4A4A] text-[#F5F5DC] p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Book Operations</h1>
        <p className="text-[#F5F5DC]/80">Student: {student?.name}</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Borrow Book Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10">
          <h2 className="text-xl font-semibold mb-4 text-[#4A4A4A]">Borrow a Book</h2>
          <form onSubmit={handleBorrow} className="space-y-4">
            <div>
              <label className="block text-[#4A4A4A] mb-2">Select Book</label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                required
                className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} by {book.author} ({book.availableCount} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#4A4A4A] mb-2">Return Date</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#4A4A4A] text-[#F5F5DC] py-2 px-4 rounded hover:bg-[#4A4A4A]/90 transition-colors duration-200"
            >
              Borrow Book
            </button>
          </form>
        </div>

        {/* Currently Borrowed Books */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10">
          <h2 className="text-xl font-semibold mb-4 text-[#4A4A4A]">Currently Borrowed Books</h2>
          {student?.issuedBooks?.length > 0 ? (
            <div className="space-y-4">
              {student.issuedBooks.map((issuedBook) => (
                <div key={issuedBook._id} className="border border-[#4A4A4A]/10 rounded-lg p-4">
                  <h3 className="font-medium text-[#4A4A4A]">{issuedBook.book.title}</h3>
                  <p className="text-sm text-[#4A4A4A]/70">Author: {issuedBook.book.author}</p>
                  <p className="text-sm text-[#4A4A4A]/70">
                    Return Date: {new Date(issuedBook.returnDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleReturn(issuedBook.book._id)}
                    className="mt-2 text-red-600 hover:text-red-700"
                  >
                    Return Book
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#4A4A4A]/70">No books currently borrowed</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/students')}
          className="bg-[#F5F5DC] text-[#4A4A4A] py-2 px-4 rounded hover:bg-[#F5F5DC]/90 transition-colors duration-200"
        >
          Back to Students
        </button>
      </div>
    </div>
  );
};

export default BookOperations; 