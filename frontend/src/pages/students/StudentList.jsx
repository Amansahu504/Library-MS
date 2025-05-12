import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/students');
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError('Error fetching students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/students/${studentId}`);
        setSuccess('Student deleted successfully');
        fetchStudents(); // Refresh the list
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting student');
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  return (
    <div className="min-h-screen bg-[#f4f6f7] p-6">
      <div className="bg-[#fdfefe] p-6 rounded-lg mb-6 shadow-lg border border-[#ecf0f1]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#2c3e50]">Students</h1>
          <Link
            to="/students/add"
            className="bg-[#2c3e50] text-white py-2 px-4 rounded hover:bg-[#2980b9] transition-colors duration-200 shadow"
          >
            Add New Student
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-[#fdfefe] shadow-lg rounded-lg p-6 border border-[#ecf0f1]">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, student no., roll number, department, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-[#ecf0f1] rounded p-2 focus:border-[#1abc9c] focus:ring-[#1abc9c]/20 bg-[#f4f6f7] text-[#2c3e50]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A4A4A]"></div>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full divide-y divide-[#ecf0f1]">
              <thead className="bg-[#ecf0f1]">
                <tr>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Student No.</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-base md:text-lg font-medium text-[#2c3e50] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#fdfefe] divide-y divide-[#ecf0f1] text-lg">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-[#4A4A4A]/70">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-[#ecf0f1]">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c3e50]">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{student.no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{student.rollNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{student.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#34495e]">{student.batch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2c3e50]">
                        <Link
                          to={`/students/${student._id}/books`}
                          className="text-[#00bcd4] hover:text-[#2980b9] mr-4"
                        >
                          View Books
                        </Link>
                        <Link
                          to={`/students/edit/${student._id}`}
                          className="text-[#1abc9c] hover:text-[#2980b9] mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList; 