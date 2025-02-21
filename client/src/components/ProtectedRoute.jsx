// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificar si el token está en localStorage
  const isAuthenticated = localStorage.getItem('token');

  // Redirigir al login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderizar los componentes hijos
  return children;
};

export default ProtectedRoute;
