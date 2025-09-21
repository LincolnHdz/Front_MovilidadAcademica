import React from 'react';
import { useAuth } from '../context/useAuth';
import Header from './Header';
import Navigation from './Navigation';

// Este componente mostrará Header o Navigation dependiendo del estado de autenticación
const ConditionalHeader = () => {
  const { isAuthenticated } = useAuth();

  // Si está autenticado, muestra Navigation, si no, muestra Header
  return isAuthenticated ? <Navigation /> : <Header />;
};

export default ConditionalHeader;