import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/books');
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError('Error fetching books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await api.delete(`/books/${bookId}`);
        setSuccess('Book deleted successfully');
        fetchBooks(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting book');
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2c3e50]">Books</h1>
          <Link
            to="/books/add"
            className="bg-[#2c3e50] text-white py-2 px-4 rounded hover:bg-[#2980b9] transition-colors duration-200 shadow"
          >
            Add New Book
          </Link>
        </div>
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

      <div className="bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title, author, ISBN, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#1abc9c] focus:ring-[#1abc9c]/20 bg-[#f4f6f7] text-[#2c3e50]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A4A4A]"></div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-[#ecf0f1]">
              <thead className="bg-[#ecf0f1]">
                <tr>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">ISBN</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Available</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#fdfefe] divide-y divide-[#ecf0f1] text-lg">
                {filteredBooks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-[#4A4A4A]/70">
                      No books found
                    </td>
                  </tr>
                ) : (
                  filteredBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-[#ecf0f1]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c3e50]">{book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{book.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{book.isbn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{book.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          book.availableCount > 0 
                            ? 'bg-[#e8f8f5] text-[#1abc9c]'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCount} available
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c3e50]">
                        <Link
                          to={`/books/edit/${book._id}`}
                          className="text-[#00bcd4] hover:text-[#2980b9] mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList; 