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
    navigate("/");
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
            className={`nav-link ${
              location.pathname === "/convocatorias-lista" ? "active" : ""
            }`}
          >
            Convocatorias
          </Link>

          {/* Link de solicitud visible solo para alumnos */}
          {user?.rol === "alumno" && (
            <Link
              to="/solicitud"
              className={`nav-link ${
                location.pathname === "/solicitud" ? "active" : ""
              }`}
            >
              Solicitud
            </Link>
          )}

          {/* Link de administración visible solo para administradores */}
          {user?.rol === "administrador" && (
            <>
              <Link
                to="/admin/usuarios"
                className={`nav-link ${
                  location.pathname === "/admin/usuarios" ? "active" : ""
                }`}
              >
                Usuarios
              </Link>
              <Link
                to="/admin/applications"
                className={`nav-link ${
                  location.pathname === "/admin/applications" ? "active" : ""
                }`}
              >
                Solicitudes
              </Link>
            </>
          )}

          {/* Usuario y botón de perfil */}
          {user && (
            <Link to="/perfil" className="user-profile-link" title="Ver perfil">
              <span className="user-clave">{user.clave || "Usuario"}</span>
            </Link>
          )}

          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
