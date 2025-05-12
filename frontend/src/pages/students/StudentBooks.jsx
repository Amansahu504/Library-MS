import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StudentBooks = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [studentRes, booksRes] = await Promise.all([
        api.get(`/students/${id}`),
        api.get('/books')
      ]);
      setStudent(studentRes.data);
      setBooks(booksRes.data);
      setFilteredBooks(booksRes.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter books based on search term
  useEffect(() => {
    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto clear success message after 2 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto clear error message after 2 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleBorrowBook = async (e) => {
    e.preventDefault();
    if (!selectedBook) {
      setError('Please select a book');
      return;
    }
    try {
      await api.post(`/students/${id}/books`, {
        bookId: selectedBook,
        issueDate: issueDate || new Date().toISOString().split('T')[0]
      });
      setSuccess('Book borrowed successfully');
      setSelectedBook('');
      setIssueDate('');
      setSearchTerm('');
      setIsDropdownOpen(false);
      fetchData(); // Refresh the data
    } catch (err) {
      setError(err.response?.data?.message || 'Error borrowing book');
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      await api.put(`/students/${id}/books/${bookId}/return`, {
        returnDate: new Date().toISOString().split('T')[0]
      });
      setSuccess('Book returned successfully');
      fetchData(); // Refresh the data
    } catch (err) {
      setError(err.response?.data?.message || 'Error returning book');
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book._id);
    setSearchTerm(`${book.title} by ${book.author} (ISBN: ${book.isbn})`);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A4A4A]"></div>
      </div>
    );
  }

  return (
    <div className="page-container bg-[#f4f6f7] min-h-screen">
      <div className="page-header bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <h1 className="page-title text-2xl font-bold text-[#2c3e50]">Student Books</h1>
        <p className="text-[#34495e] opacity-90">Student: {student?.name}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Borrow Book Form */}
        <div className="card bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
          <h2 className="text-xl font-semibold mb-4 text-[#2c3e50]">Borrow a Book</h2>
          <form onSubmit={handleBorrowBook} className="space-y-4">
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="searchBook" className="block text-sm font-medium text-[#2c3e50] mb-1">
                Search and Select Book
              </label>
              <input
                type="text"
                id="searchBook"
                placeholder="Search by title, author, ISBN, or category..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                  setSelectedBook('');
                }}
                className="input w-full border-[#ecf0f1] focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
                autoComplete="off"
              />
              {isDropdownOpen && filteredBooks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-[#4A4A4A]/10">
                  {filteredBooks.map((book) => (
                    <div
                      key={book._id}
                      onClick={() => handleBookSelect(book)}
                      className="px-4 py-2 hover:bg-[#F5F5DC] cursor-pointer border-b border-[#4A4A4A]/10 last:border-b-0"
                    >
                      <div className="font-medium text-[#4A4A4A]">{book.title}</div>
                      <div className="text-sm text-[#4A4A4A]/70">
                        Author: {book.author} | ISBN: {book.isbn}
                      </div>
                      <div className="text-sm text-[#4A4A4A]/50">
                        Category: {book.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isDropdownOpen && filteredBooks.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-[#4A4A4A]/10">
                  <div className="px-4 py-2 text-[#4A4A4A]/70">
                    No books found matching your search
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-[#4A4A4A] mb-1">
                Issue Date
              </label>
              <input
                type="date"
                id="issueDate"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="input w-full border-[#4A4A4A]/20 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              />
            </div>

            <button 
              type="submit"
              className="bg-[#2c3e50] text-white py-2 px-4 rounded hover:bg-[#2980b9] transition-colors duration-200 float-right mt-2"
            >
              Borrow Book
            </button>
          </form>
        </div>

        {/* Currently Borrowed Books */}
        <div className="card bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10 md:max-h-[600px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-[#4A4A4A]">Currently Borrowed Books</h2>
          {student?.issuedBooks?.length > 0 ? (
            <div className="table-container">
              <table className="min-w-full divide-y divide-[#4A4A4A]/10">
                <thead className="bg-[#4A4A4A]/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Book Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Issue Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Return Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4A4A4A] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#4A4A4A]/10">
                  {student.issuedBooks.map((issuedBook) => (
                    <tr key={issuedBook._id} className="hover:bg-[#F5F5DC]/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                        {issuedBook.book?.title || 'Book not found'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                        {issuedBook.book?.author || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                        {new Date(issuedBook.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                        {issuedBook.returnDate ? new Date(issuedBook.returnDate).toLocaleDateString() : 'Not returned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          issuedBook.returnDate 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {issuedBook.returnDate ? 'Returned' : 'Borrowed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4A4A]">
                        {!issuedBook.returnDate && (
                          <button
                            onClick={() => handleReturnBook(issuedBook.book?._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#4A4A4A]/70">No books currently borrowed.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentBooks; 