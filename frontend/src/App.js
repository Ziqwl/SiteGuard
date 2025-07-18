import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// Импортируем компоненты
import Header from "./components/Header";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Documentation from "./components/Documentation";
import AIChat from "./components/AIChat";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Проверяем сохраненный токен при загрузке
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route path="/docs" element={<Documentation />} />
        </Routes>

        {/* AI Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        {/* AI Chat Modal */}
        <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </BrowserRouter>
    </div>
  );
}

export default App;
