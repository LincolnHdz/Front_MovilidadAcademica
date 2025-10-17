import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si hay un token y datos de usuario en localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      setIsAuthenticated(true);
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}