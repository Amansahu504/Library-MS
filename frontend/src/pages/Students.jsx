import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', rollNo: '', department: '', batch: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students');
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.batch.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

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
        await api.put(`/students/${editingId}`, form);
        setMessage('Student updated successfully');
      } else {
        await api.post('/students', form);
        setMessage('Student added successfully');
      }
      setForm({ name: '', rollNo: '', department: '', batch: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || `Error ${editingId ? 'updating' : 'adding'} student`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      rollNo: student.rollNo,
      department: student.department,
      batch: student.batch
    });
    setEditingId(student._id);
  };

  const handleCancel = () => {
    setForm({ name: '', rollNo: '', department: '', batch: '' });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Manage Students</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl mb-4">{editingId ? 'Edit Student' : 'Add Student'}</h2>
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
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="rollNo"
            type="text"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="department"
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="border p-2 rounded"
            required
            disabled={loading}
          />
          <input
            name="batch"
            type="text"
            placeholder="Batch"
            value={form.batch}
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
              {loading ? 'Saving...' : editingId ? 'Update Student' : 'Add Student'}
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
            placeholder="Search by name, roll number, department, or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <h2 className="text-xl mb-4">Student List</h2>
        <div className="overflow-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Roll No</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Batch</th>
                <th className="px-4 py-2">Issued Books</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((stu) => (
                <tr key={stu._id} className="text-center border-t">
                  <td className="px-4 py-2">{stu.name}</td>
                  <td className="px-4 py-2">{stu.rollNo}</td>
                  <td className="px-4 py-2">{stu.department}</td>
                  <td className="px-4 py-2">{stu.batch}</td>
                  <td className="px-4 py-2">
                    {stu.issuedBooks?.length > 0 ? (
                      <ul className="list-disc list-inside text-left">
                        {stu.issuedBooks.map((ib) => (
                          <li key={ib._id}>
                            {ib.book.title} (Due: {new Date(ib.returnDate).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'None'
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(stu)}
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

export default Students; 