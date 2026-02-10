import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold hover:text-primary transition">
            InternConnect
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-300">Welcome, {user.name}</span>
                <Link 
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  className="text-gray-300 hover:text-white transition"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="bg-primary hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;