import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Settings, MessageCircle, Star, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SkillSwap</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-700 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>
              
              <Link
                to="/requests"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="hidden sm:block">Requests</span>
              </Link>
              
              <Link
                to="/reviews"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="hidden sm:block">Reviews</span>
              </Link>
              
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">{user.name}</span>
              </Link>
              
              {user.isAdmin && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                  title="Admin Dashboard"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              )}
              
              <Link
                to="/settings"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;