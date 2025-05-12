import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Reset menu state when component mounts or user changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [user]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) return null;

  return (
    <>
      <nav className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-white text-xl font-bold">
                  Library MS
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Dashboard
                  </Link>
                  {(user?.role === 'admin' || user?.role === 'employee') && (
                    <>
                      <Link
                        to="/books"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/books')
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Books
                      </Link>
                      <Link
                        to="/students"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/students')
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Students
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to="/register-employee"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/register-employee')
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Register Employee
                      </Link>
                      <Link
                        to="/employee-applications"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive('/employee-applications')
                            ? 'bg-white/20 text-white'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        Employee Applications
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="flex items-center text-white/80 hover:text-white focus:outline-none"
                >
                  <span className="mr-2">{user.name}</span>
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isMenuOpen ? 'transform rotate-180' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(e, '/');
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/')
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              {(user?.role === 'admin' || user?.role === 'employee') && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(e, '/books');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/books')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Books
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(e, '/students');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/students')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Students
                  </button>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(e, '/register-employee');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/register-employee')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Register Employee
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(e, '/employee-applications');
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/employee-applications')
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Employee Applications
                  </button>
                </>
              )}
              {user && (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar; 