import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    availableCount: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/books', formData);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <h1 className="text-2xl font-bold text-[#2c3e50]">Add New Book</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#2c3e50] mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Number of Books Available</label>
            <input
              type="number"
              name="availableCount"
              min="1"
              value={formData.availableCount}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="bg-[#ecf0f1] text-[#2c3e50] py-2 px-4 rounded hover:bg-[#e4e8eb] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-[#2c3e50] text-white py-2 px-4 rounded hover:bg-[#2980b9] transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;