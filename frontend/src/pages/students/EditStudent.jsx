import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    no: '',
    rollNo: '',
    department: '',
    batch: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await api.get(`/students/${id}`);
        setFormData(data);
      } catch (err) {
        setError('Error fetching student details');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await api.put(`/students/${id}`, formData);
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating student');
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
        <h1 className="text-2xl font-bold">Edit Student</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 border border-[#4A4A4A]/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#4A4A4A] mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Student No.</label>
            <input
              type="text"
              name="no"
              value={formData.no}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Roll Number</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Batch</label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/students')}
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

export default EditStudent; 