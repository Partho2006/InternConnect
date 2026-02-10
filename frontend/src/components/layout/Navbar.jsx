import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              InternConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                    isActive(`/${user.role}/dashboard`)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3 border-l pl-6">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t animate-slide-down">
          <div className="px-4 py-3 space-y-3 bg-white">
            {user ? (
              <>
                <div className="flex items-center space-x-2 pb-3 border-b">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;