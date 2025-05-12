import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register-employee', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error registering employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <h1 className="text-2xl font-bold text-[#2c3e50]">Register New Employee</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#2c3e50] mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2c3e50] mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#2c3e50] focus:ring-[#2c3e50]/20 bg-[#f4f6f7] text-[#2c3e50]"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-[#ecf0f1] text-[#2c3e50] py-2 px-4 rounded hover:bg-[#e4e8eb] transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-[#2c3e50] text-white py-2 px-4 rounded hover:bg-[#2980b9] transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEmployee; 