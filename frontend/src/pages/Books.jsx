import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      console.error(err);
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, form);
        setMessage('Book updated successfully');
      } else {
        await api.post('/books', form);
        setMessage('Book added successfully');
      }
      setForm({ title: '', author: '', isbn: '', category: '' });
      setEditingId(null);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.message || `Error ${editingId ? 'updating' : 'adding'} book`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category
    });
    setEditingId(book._id);
  };

  const handleCancel = () => {
    setForm({ title: '', author: '', isbn: '', category: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Manage Books</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl mb-4">{editingId ? 'Edit Book' : 'Add Book'}</h2>
        {message && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="author"
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="isbn"
            type="text"
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <div className="col-span-full flex gap-2">
            <button
              type="submit"
              className={`flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Saving...' : editingId ? 'Update Book' : 'Add Book'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title, author, ISBN, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <h2 className="text-xl mb-4">Book List</h2>
        <div className="overflow-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">ISBN</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book._id} className="text-center border-t">
                  <td className="px-4 py-2">{book.title}</td>
                  <td className="px-4 py-2">{book.author}</td>
                  <td className="px-4 py-2">{book.isbn}</td>
                  <td className="px-4 py-2">{book.category}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Books; 