import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SiteGuard Pro+
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Главная
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/analytics" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/analytics') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Analytics
                </Link>
                <Link 
                  to="/notifications" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/notifications') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  Notifications
                </Link>
                <Link 
                  to="/seo" 
                  className={`text-sm font-medium transition-colors ${
                    isActive('/seo') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  SEO
                </Link>
              </>
            )}
            <Link 
              to="/docs" 
              className={`text-sm font-medium transition-colors ${
                isActive('/docs') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Docs
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Привет, {user.username}
                </span>
                <button
                  onClick={onLogout}
                  className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Вход
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notifications
                  </Link>
                  <Link
                    to="/seo"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SEO
                  </Link>
                </>
              )}
              <Link
                to="/docs"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Docs
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;