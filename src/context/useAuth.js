import { useContext } from 'react';
import AuthContext from './AuthContext';

// Hook para acceder al contexto de autenticación
export function useAuth() {
  return useContext(AuthContext);
}