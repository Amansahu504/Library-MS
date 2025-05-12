import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('employee'); // 'admin' or 'employee'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        userType
      });
      
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50]/5 to-[#3498DB]/5 flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2C3E50]">Welcome Back</h2>
          <p className="mt-2 text-[#2C3E50]/70">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm">
            {error}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-8 border border-[#2C3E50]/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-[#2C3E50]">
                User Type
              </label>
              <select
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="mt-1 block w-full border border-[#2C3E50]/20 rounded-lg p-3 bg-white/50 backdrop-blur-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]/20"
                disabled={loading}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-[#2C3E50]/20 rounded-lg p-3 bg-white/50 backdrop-blur-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]/20"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C3E50]">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-[#2C3E50]/20 rounded-lg p-3 bg-white/50 backdrop-blur-sm focus:border-[#2C3E50] focus:ring-[#2C3E50]/20"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#2C3E50] to-[#3498DB] hover:from-[#2C3E50]/90 hover:to-[#3498DB]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2C3E50] transition-colors duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/employee-application"
              className="text-sm text-[#2C3E50] hover:text-[#3498DB] transition-colors duration-200"
            >
              Apply for employee access here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 