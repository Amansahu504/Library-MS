import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    availableCount: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await api.get(`/books/${id}`);
        setFormData(data);
      } catch (err) {
        setError('Error fetching book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

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
    setSaving(true);

    try {
      await api.put(`/books/${id}`, formData);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating book');
    } finally {
      setSaving(false);
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
        <h1 className="text-2xl font-bold">Edit Book</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#4A4A4A] mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Number of Books Available</label>
            <input
              type="number"
              name="availableCount"
              min="0"
              value={formData.availableCount}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/books')}
              className="bg-[#F5F5DC] text-[#4A4A4A] py-2 px-4 rounded hover:bg-[#F5F5DC]/90 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-[#4A4A4A] text-[#F5F5DC] py-2 px-4 rounded hover:bg-[#4A4A4A]/90 transition-colors duration-200 ${
                saving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook; 