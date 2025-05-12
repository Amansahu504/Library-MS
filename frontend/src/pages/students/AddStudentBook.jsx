import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddStudentBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    bookId: '',
    returnDate: ''
  });

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      setError('Error fetching books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post(`/students/${id}/books`, form);
      setSuccess('Book added successfully');
      setTimeout(() => {
        navigate(`/students/${id}/books`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Add Book to Student</h1>
        <button
          onClick={() => navigate(`/students/${id}/books`)}
          className="btn btn-secondary"
        >
          Back to Student's Books
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 mb-1">
                Select Book
              </label>
              <select
                id="bookId"
                name="bookId"
                value={form.bookId}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Select a book</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} - {book.author} (ISBN: {book.isbn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                value={form.returnDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="input"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/students/${id}/books`)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Book'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddStudentBook; 