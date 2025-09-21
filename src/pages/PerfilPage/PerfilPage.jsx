import React from "react";
import { useAuth } from "../../context/useAuth";
import "./PerfilPage.css";

const PerfilPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="perfil-container">
        <h2>Perfil no disponible</h2>
        <p>Por favor inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {user.nombres ? user.nombres.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="perfil-title-actions">
            <h3>
              {user.nombres} {user.apellidos}
            </h3>
            <button className="change-password-btn">
              Cambiar contraseña
            </button>
          </div>
        </div>
        
        <div className="perfil-info">
          <div className="info-item">
            <span className="label">Clave:</span>
            <span className="value">{user.clave}</span>
          </div>
          <div className="info-item">
            <span className="label">Correo:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Teléfono:</span>
            <div className="value-with-action">
              <span className="value">{user.telefono || "No registrado"}</span>
              <button className="add-phone-btn">
                {user.telefono ? "Editar teléfono" : "Añadir teléfono"}
              </button>
            </div>
          </div>
          <div className="info-item">
            <span className="label">Rol:</span>
            <span className="value">{user.rol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;