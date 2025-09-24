import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import "./PerfilPage.css";

const PerfilPage = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  // Estado para selects de universidad, facultad, carrera y beca
  const [universidad, setUniversidad] = useState("");
  const [facultad, setFacultad] = useState("");
  const [carrera, setCarrera] = useState("");
  const [beca, setBeca] = useState("");

  // Opciones vacías, para llenar desde el backend en el futuro
  const universidades = [];
  const facultades = [];
  const carreras = [];
  const becas = [];

  // Buscar la solicitud del usuario cuando se carga el componente
  useEffect(() => {
    const fetchUserApplication = async () => {
      try {
        if (user) {
          setLoading(true);
          // Usar la nueva ruta específica para obtener las aplicaciones del usuario autenticado
          const response = await api.get(`/applications/user/applications`);
          
          if (response.data && response.data.success && response.data.data.length > 0) {
            // Tomamos la primera solicitud (la más reciente)
            setApplication(response.data.data[0]);
          }
        }
      } catch (error) {
        console.error("Error al obtener la solicitud del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserApplication();
  }, [user]);

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
              {user.nombres} {user.apellido_paterno} {user.apellido_materno}
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
          <div className="info-item">
            <span className="label">Universidad:</span>
            <select
              className="perfil-select"
              value={universidad}
              onChange={e => setUniversidad(e.target.value)}
              disabled={universidades.length === 0}
            >
              <option value="">Selecciona tu universidad</option>
              {universidades.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="info-item">
            <span className="label">Facultad:</span>
            <select
              className="perfil-select"
              value={facultad}
              onChange={e => setFacultad(e.target.value)}
              disabled={facultades.length === 0}
            >
              <option value="">Selecciona tu facultad</option>
              {facultades.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="info-item">
            <span className="label">Carrera:</span>
            <select
              className="perfil-select"
              value={carrera}
              onChange={e => setCarrera(e.target.value)}
              disabled={carreras.length === 0}
            >
              <option value="">Selecciona tu carrera</option>
              {carreras.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="info-item">
            <span className="label">Beca:</span>
            <select
              className="perfil-select"
              value={beca}
              onChange={e => setBeca(e.target.value)}
              disabled={becas.length === 0}
            >
              <option value="">Selecciona tu beca</option>
              {becas.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Sección para mostrar la solicitud del usuario solo si NO es admin */}
      {user.rol !== 'administrador' && (
        loading ? (
          <div className="application-loading">
            <div className="loading-spinner"></div>
            <p>Cargando solicitud...</p>
          </div>
        ) : application ? (
          <div className="application-card">
            <h3>Mi Solicitud de Movilidad</h3>
            <div className="application-status">
              <span className={`status-badge ${application.estado}`}>
                {application.estado || "Pendiente"}
              </span>
            </div>
            <div className="application-details">
              <div className="detail-item">
                <span className="label">Universidad:</span>
                <span className="value">{application.universidad}</span>
              </div>
              <div className="detail-item">
                <span className="label">Carrera:</span>
                <span className="value">{application.carrera}</span>
              </div>
              <div className="detail-item">
                <span className="label">Materia:</span>
                <span className="value">{application.materia}</span>
              </div>
              <div className="detail-item">
                <span className="label">Clave de Materia:</span>
                <span className="value">{application.claveMateria}</span>
              </div>
              <div className="detail-item">
                <span className="label">Ciclo Escolar:</span>
                <span className="value">{application.cicloEscolar}</span>
              </div>
              <div className="detail-item">
                <span className="label">Fecha de Solicitud:</span>
                <span className="value">
                  {new Date(application.created_at).toLocaleDateString()}
                </span>
              </div>
              {application.archivo && application.archivo.filename && (
                <div className="detail-item">
                  <span className="label">Archivo de Solicitud:</span>
                  {(() => {
                    let archivo = application.archivo;
                    if (archivo && typeof archivo === 'string') {
                      try { archivo = JSON.parse(archivo); } catch { archivo = null; }
                    }
                    return archivo && archivo.filename ? (
                      <a
                        href={`http://localhost:3000/uploads/${archivo.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="archivo-link"
                      >
                        Descargar archivo
                      </a>
                    ) : <span style={{color: 'red'}}>Archivo no disponible</span>;
                  })()}
                </div>
              )}
                {/* Comentarios de la solicitud */}
                {application.estado === 'rechazada' && (
                  <div className="application-comments-section">
                    <h4>Comentarios de la solicitud</h4>
                    {Array.isArray(application.comentarios) && application.comentarios.length > 0 ? (
                      application.comentarios.map((comentario, idx) => (
                        <div className="application-comment" key={idx}>
                          {comentario}
                        </div>
                      ))
                    ) : (typeof application.comentarios === 'string' && application.comentarios.trim() !== '' ? (
                      <div className="application-comment">{application.comentarios}</div>
                    ) : (
                      <div className="application-comment" style={{color: '#e74c3c'}}>
                        No hay comentarios para esta solicitud.
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="no-application">
            <p>No has realizado ninguna solicitud de movilidad.</p>
          </div>
        )
      )}
      
      {/* Espacio adicional al final de la página */}
      <div className="perfil-footer-space"></div>
    </div>
  );
};

export default PerfilPage;