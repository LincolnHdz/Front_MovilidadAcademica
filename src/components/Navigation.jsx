import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
