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
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-purple-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <BriefcaseIcon className="h-7 w-7 text-gray-800" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                InternConnect
              </span>
              <span className="text-xs text-gray-500 font-semibold -mt-1">Find Your Dream Role</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {/* Dashboard Link */}
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold ${isActive(`/${user.role}/dashboard`)
                      ? 'bg-purple-100 text-purple-700 shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {/* User Info & Logout */}
                <div className="flex items-center gap-4 pl-6 border-l-2 border-gray-200">
                  {/* User Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <UserCircleIcon className="h-10 w-10 text-purple-600" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600 capitalize bg-purple-50 px-2 py-0.5 rounded-full inline-block">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all duration-300 font-semibold border border-red-200 hover:border-red-300"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 font-semibold transition-colors duration-300 px-4 py-2"
                >
                  Login
                </Link>

                {/* Get Started Button */}
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-gray-800 px-8 py-3 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-purple-50 transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-purple-100 animate-slide-down shadow-xl">
          <div className="px-6 py-6 space-y-4 bg-white">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-100">
                  <div className="relative">
                    <UserCircleIcon className="h-12 w-12 text-purple-600" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 capitalize bg-purple-50 px-3 py-1 rounded-full inline-block mt-1">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Dashboard Link */}
                <Link
                  to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl font-semibold transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-700 bg-red-50 hover:bg-red-100 rounded-xl font-semibold transition-colors border border-red-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold text-center transition-colors"
                >
                  Login
                </Link>

                {/* Get Started Button */}
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-gray-800 rounded-xl font-bold text-center hover:shadow-xl transition-all"
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