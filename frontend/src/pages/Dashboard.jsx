import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-8 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <h1 className="text-3xl font-bold text-[#2c3e50]">Welcome, {user && user.name}</h1>
        <p className="text-[#34495e] opacity-90 mt-2">
          Role: <span className="text-[#1abc9c] font-semibold">{user && user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 