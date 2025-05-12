import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RegisterEmployee from './pages/RegisterEmployee';
import EmployeeApplication from './pages/EmployeeApplication';
import EmployeeApplications from './pages/EmployeeApplications';
import BookList from './pages/books/BookList';
import AddBook from './pages/books/AddBook';
import EditBook from './pages/books/EditBook';
import StudentList from './pages/students/StudentList';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';
import StudentBooks from './pages/students/StudentBooks';

function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/apply-employee"
          element={!user ? <EmployeeApplication /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register-employee"
          element={
            user ? (
              user.role === 'admin' ? (
                <RegisterEmployee />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/employee-applications"
          element={
            user ? (
              user.role === 'admin' ? (
                <EmployeeApplications />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/books"
          element={user ? <BookList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/books/add"
          element={user ? <AddBook /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/books/edit/:id"
          element={user ? <EditBook /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/students"
          element={user ? <StudentList /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/students/add"
          element={user ? <AddStudent /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/students/edit/:id"
          element={user ? <EditStudent /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/students/:id/books"
          element={user ? <StudentBooks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
