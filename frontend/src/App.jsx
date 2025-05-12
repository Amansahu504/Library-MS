import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements,
  Route 
} from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentList from './pages/students/StudentList';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';
import StudentBooks from './pages/students/StudentBooks';
import BookList from './pages/books/BookList';
import AddBook from './pages/books/AddBook';
import EditBook from './pages/books/EditBook';
import BookOperations from './pages/books/BookOperations';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PrivateRoute from './components/PrivateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Navbar />}>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        {/* Book routes */}
        <Route path="/books">
          <Route index element={<BookList />} />
          <Route path="add" element={<AddBook />} />
          <Route path=":id/edit" element={<EditBook />} />
          <Route path="operations" element={<BookOperations />} />
        </Route>

        {/* Student routes */}
        <Route path="/students">
          <Route index element={<StudentList />} />
          <Route path="add" element={<AddStudent />} />
          <Route path=":id/edit" element={<EditStudent />} />
          <Route path=":id/books" element={<StudentBooks />} />
        </Route>

        {/* Dashboard route */}
        <Route path="/" element={<StudentList />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <div className="min-h-screen bg-[#F5F5DC]">
      <div className="container mx-auto px-4 py-8">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App; 