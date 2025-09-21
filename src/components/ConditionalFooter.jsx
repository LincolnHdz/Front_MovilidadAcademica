import React from 'react';
import { useAuth } from '../context/useAuth';
import Footer from './Footer';

// Este componente mostrará o no el Footer dependiendo del estado de autenticación
const ConditionalFooter = () => {
  const { isAuthenticated } = useAuth();

  // Si está autenticado, no muestra el Footer, si no está autenticado, lo muestra
  return isAuthenticated ? null : <Footer />;
};

export default ConditionalFooter;