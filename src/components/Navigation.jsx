import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <h2>Movilidad Académica</h2>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Inicio
          </Link>
          <Link 
            to="/convocatorias-lista" 
            className={`nav-link ${location.pathname === "/convocatorias-lista" ? "active" : ""}`}
          >
            Convocatorias
          </Link>
          
          {/* Usuario y botón de perfil */}
          {user && (
            <Link
              to="/perfil"
              className="user-profile-link"
              title="Ver perfil"
            >
              <span className="user-clave">{user.clave || "Usuario"}</span>
            </Link>
          )}
          
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
