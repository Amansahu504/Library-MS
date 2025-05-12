import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EmployeeApplications = () => {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/auth/pending-applications');
      setApplications(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (applicationId) => {
    setError('');
    setMessage('');

    try {
      await api.post(`/auth/approve-application/${applicationId}`);
      setMessage('Application approved successfully');
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving application');
    }
  };

  const handleReject = async (applicationId) => {
    setError('');
    setMessage('');

    try {
      await api.post(`/auth/reject-application/${applicationId}`);
      setMessage('Application rejected successfully');
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || 'Error rejecting application');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <h1 className="text-2xl font-bold text-[#2c3e50]">Employee Applications</h1>
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

      <div className="bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c3e50]"></div>
          </div>
        ) : applications.length === 0 ? (
          <p className="text-[#34495e] text-center py-4">No pending applications</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-[#ecf0f1]">
              <thead className="bg-[#ecf0f1]">
                <tr>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Applied On</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#fdfefe] divide-y divide-[#ecf0f1] text-lg">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#ecf0f1]">
                    <td className="px-6 py-4 whitespace-nowrap text-[#2c3e50]">{app.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#34495e]">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-[#34495e]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApprove(app._id)}
                          className="bg-[#2c3e50] text-white px-4 py-2 rounded hover:bg-[#2980b9] transition-colors duration-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeApplications; 