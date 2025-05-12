import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const EmployeeApplication = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/apply-employee', { name, email, password });
      setMessage('Application submitted successfully. Please wait for admin approval.');
      setError('');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting application');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] p-6">
      <div className="bg-[#4A4A4A] text-[#F5F5DC] p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Apply for Employee Account</h1>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <div>
            <label className="block text-[#4A4A4A] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#4A4A4A]/20 rounded p-2 focus:border-[#4A4A4A] focus:ring-[#4A4A4A]/20"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-[#4A4A4A] text-[#F5F5DC] py-2 px-4 rounded hover:bg-[#4A4A4A]/90 transition-colors duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeApplication; 