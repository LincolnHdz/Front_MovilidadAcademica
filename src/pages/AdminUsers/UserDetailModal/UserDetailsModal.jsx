import React from "react";
import "./UserDetailsModal.css";

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div
        className="user-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-modal-header">
          <h2>Detalles del Usuario</h2>
        </div>

        <div className="user-modal-body">
          {/* Información Personal */}
          <div className="user-modal-section">
            <h3>Información Personal</h3>
            <div className="user-modal-grid">
              <div className="user-modal-item">
                <span className="user-modal-label">ID:</span>
                <span className="user-modal-value">{user.id}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Nombres:</span>
                <span className="user-modal-value">{user.nombres}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Apellido Paterno:</span>
                <span className="user-modal-value">{user.apellido_paterno}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Apellido Materno:</span>
                <span className="user-modal-value">{user.apellido_materno || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Clave:</span>
                <span className="user-modal-value">{user.clave || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Teléfono:</span>
                <span className="user-modal-value">{user.telefono || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Email:</span>
                <span className="user-modal-value">{user.email}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Rol:</span>
                <span className={`user-role role-${user.rol}`}>
                  {user.rol}
                </span>
              </div>
            </div>
          </div>

          {/* Información Académica */}
          <div className="user-modal-section">
            <h3>Información Académica</h3>
            <div className="user-modal-grid">
              <div className="user-modal-item">
                <span className="user-modal-label">Tipo de Movilidad:</span>
                <span className="user-modal-value">
                  {user.tipo_movilidad
                    ? user.tipo_movilidad
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "N/A"}
                </span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Ciclo Escolar:</span>
                <span className="user-modal-value">{user.ciclo_escolar || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Universidad ID:</span>
                <span className="user-modal-value">{user.universidad_id || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Facultad ID:</span>
                <span className="user-modal-value">{user.facultad_id || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Carrera ID:</span>
                <span className="user-modal-value">{user.carrera_id || "N/A"}</span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Beca ID:</span>
                <span className="user-modal-value">{user.beca_id || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Información del Sistema */}
          <div className="user-modal-section">
            <h3>Información del Sistema</h3>
            <div className="user-modal-grid">
              <div className="user-modal-item">
                <span className="user-modal-label">Fecha de Creación:</span>
                <span className="user-modal-value">
                  {user.created_at
                    ? new Date(user.created_at).toLocaleString("es-MX")
                    : "N/A"}
                </span>
              </div>
              <div className="user-modal-item">
                <span className="user-modal-label">Última Actualización:</span>
                <span className="user-modal-value">
                  {user.updated_at
                    ? new Date(user.updated_at).toLocaleString("es-MX")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="user-modal-footer">
          <button className="user-modal-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
