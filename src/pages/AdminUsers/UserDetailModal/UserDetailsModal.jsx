import React, { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import "./UserDetailsModal.css";

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await api.get(`/users/${userId}`, config);

        const { data } = response;
        if (!data.success)
          throw new Error(data.message || "Error al obtener usuario");

        setUser(data.data);
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <h2>Detalles del Usuario</h2>
        </div>

        {loading ? (
          /* ===== Skeleton Loading ===== */
          <div className="skeleton-container">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="skeleton-item"></div>
            ))}
          </div>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : !user ? (
          <p>No se encontró la información del usuario.</p>
        ) : (
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
                  <span className="user-modal-value">
                    {user.apellido_paterno}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Apellido Materno:</span>
                  <span className="user-modal-value">
                    {user.apellido_materno || "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Clave:</span>
                  <span className="user-modal-value">{user.clave || "N/A"}</span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Teléfono:</span>
                  <span className="user-modal-value">
                    {user.telefono || "N/A"}
                  </span>
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
                  <span className="user-modal-label">Ciclo Escolar Inicio:</span>
                  <span className="user-modal-value">
                    {user.ciclo_escolar_inicio || "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Ciclo Escolar Final:</span>
                  <span className="user-modal-value">
                    {user.ciclo_escolar_final || "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Universidad:</span>
                  <span className="user-modal-value">
                    {user.universidad?.nombre ||
                      user.universidad_id ||
                      "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Facultad:</span>
                  <span className="user-modal-value">
                    {user.facultad?.nombre || user.facultad_id || "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Carrera:</span>
                  <span className="user-modal-value">
                    {user.carrera?.nombre || user.carrera_id || "N/A"}
                  </span>
                </div>
                <div className="user-modal-item">
                  <span className="user-modal-label">Beca:</span>
                  <span className="user-modal-value">
                    {user.beca?.nombre || user.beca_id || "N/A"}
                  </span>
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
                  <span className="user-modal-label">
                    Última Actualización:
                  </span>
                  <span className="user-modal-value">
                    {user.updated_at
                      ? new Date(user.updated_at).toLocaleString("es-MX")
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="user-modal-footer">
          <button className="user-modal-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
