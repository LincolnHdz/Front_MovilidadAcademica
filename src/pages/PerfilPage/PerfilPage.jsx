import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import MateriasSlider from "../../components/MateriasSlider";
import CicloEscolarSelector from "../../components/CicloEscolarSelector/CicloEscolarSelector";
import "./PerfilPage.css";

const PerfilPage = () => {
  const { user, updateUser } = useAuth();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneSuccess, setPhoneSuccess] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showClaveModal, setShowClaveModal] = useState(false);
  const [newClave, setNewClave] = useState("");
  const [claveLoading, setClaveLoading] = useState(false);
  const [claveError, setClaveError] = useState("");
  const [claveSuccess, setClaveSuccess] = useState("");

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [becas, setBecas] = useState([]);

  useEffect(() => {
    if (user && user.telefono) {
      setNewPhone(user.telefono);
    }
  }, [user]);

  // Carga inicial de universidades y becas
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        console.log("Intentando cargar catálogos iniciales...");
        
        // Carga individual de universidades
        try {
          const uRes = await api.get("/catalogo/universidades");
          console.log("Respuesta universidades:", uRes.data);
          setUniversidades(uRes.data.data || []);
        } catch (error) {
          console.error("Error cargando universidades:", error.message);
        }
        
        // Carga individual de becas
        try {
          const bRes = await api.get("/catalogo/becas");
          console.log("Respuesta becas:", bRes.data);
          setBecas(bRes.data.data || []);
        } catch (error) {
          console.error("Error cargando becas:", error.message);
        }
      } catch (err) {
        console.error("Error general cargando catálogos:", err);
      }
    };
    fetchCatalogos();
  }, []);
  
  // Carga de todas las facultades (independiente de la universidad)
  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        console.log("Cargando todas las facultades...");
        const response = await api.get("/catalogo/facultades");
        console.log("Respuesta todas las facultades:", response.data);
        setFacultades(response.data.data || []);
      } catch (error) {
        console.error("Error cargando facultades:", error.message);
        setFacultades([]);
      }
    };
    
    fetchFacultades();
  }, []); // Solo se ejecuta una vez al montar el componente
  
  // Carga de carreras cuando cambia la facultad seleccionada
  useEffect(() => {
    const fetchCarreras = async () => {
      if (!user || !user.facultad_id) {
        setCarreras([]);
        return;
      }
      
      try {
        const facultadId = user.facultad_id;
        console.log(`Cargando carreras para la facultad ${facultadId}...`);
        const response = await api.get(`/catalogo/facultades/${facultadId}/carreras`);
        console.log("Respuesta carreras por facultad:", response.data);
        setCarreras(response.data.data || []);
      } catch (error) {
        console.error(`Error cargando carreras para la facultad:`, error.message);
        setCarreras([]);
      }
    };
    
    fetchCarreras();
  }, [user]); // Mantener dependencia de user para detectar cambios en facultad_id

  useEffect(() => {
    const fetchUserApplication = async () => {
      try {
        if (user) {
          setLoading(true);
          const response = await api.get(`/applications/user/applications`);
          
          if (response.data && response.data.success && response.data.data.length > 0) {
            const applicationData = response.data.data[0];
            
            // Procesar materias de interés si existen
            if (applicationData.materiasinteres) {
              // Si es una cadena JSON, intentar parsearla
              if (typeof applicationData.materiasinteres === 'string') {
                try {
                  applicationData.materiasinteres = JSON.parse(applicationData.materiasinteres);
                } catch (error) {
                  console.error("Error al parsear materiasinteres:", error);
                  applicationData.materiasinteres = [];
                }
              }
            } else {
              applicationData.materiasinteres = [];
            }
            
            setApplication(applicationData);
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

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    try {
      const response = await api.post(`/users/${user.id}/cambiar-password`, {
        currentPassword: oldPassword,
        newPassword
      });
      if (response.data.success) {
        setPasswordSuccess("Contraseña actualizada correctamente");
        setTimeout(() => {
          setShowPasswordModal(false);
          setOldPassword("");
          setNewPassword("");
        }, 1500);
      } else {
        setPasswordError(response.data.message || "No se pudo cambiar la contraseña");
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePhoneChange = async () => {
    setPhoneLoading(true);
    setPhoneError("");
    try {
      const response = await api.patch(`/users/${user.id}`, { telefono: newPhone });
      if (response.data.success) {
        updateUser({ ...user, telefono: newPhone });
        setPhoneSuccess("Teléfono actualizado correctamente");
        setTimeout(() => setShowPhoneModal(false), 1500);
      } else {
        setPhoneError(response.data.message || "No se pudo actualizar el teléfono");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
    } finally {
      setPhoneLoading(false);
    }
  };
  
  const handleClaveChange = async () => {
    setClaveLoading(true);
    setClaveError("");

    try {
      const claveValue = newClave.trim();
      console.log("Enviando clave:", claveValue, "Tipo:", typeof claveValue);
      console.log("Payload completo:", { clave: claveValue });
      
      // Si está vacío, enviar null explícitamente
      const payload = { clave: claveValue === "" ? null : claveValue };
      
      const response = await api.patch(`/users/${user.id}`, payload);
      if (response.data.success) {
        updateUser({ ...user, clave: claveValue === "" ? null : claveValue });
        setClaveSuccess("Clave actualizada correctamente");
        setTimeout(() => {
          setShowClaveModal(false);
          setNewClave("");
          setClaveError("");
          setClaveSuccess("");
        }, 1500);
      } else {
        setClaveError(response.data.message || "No se pudo actualizar la clave");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setClaveError(err.response?.data?.message || "Error al conectar con el servidor");
    } finally {
      setClaveLoading(false);
    }
  };

  const handleFieldUpdate = async (fieldName, value) => {
    try {
      const endpoint = fieldName === 'tipo_movilidad' 
        ? `/users/${user.id}/tipo-movilidad`
        : fieldName === 'ciclo_escolar'
        ? `/users/${user.id}/ciclo-escolar`
        : `/users/${user.id}`;
      
      const response = await api.patch(endpoint, { [fieldName]: value });
      
      if (response.data.success) {
        const updatedUser = { ...user, [fieldName]: value };
        
        // Si se cambia la facultad, resetear la carrera
        if (fieldName === 'facultad_id') {
          updatedUser.carrera_id = null;
          // También actualizar la carrera en el backend
          try {
            await api.patch(`/users/${user.id}`, { carrera_id: null });
          } catch (carreraError) {
            console.error("Error al resetear carrera:", carreraError);
          }
        }
        
        updateUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error al actualizar ${fieldName}:`, error);
      return false;
    }
  };

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
            <h3>{user.nombres} {user.apellido_paterno} {user.apellido_materno}</h3>
            <button className="change-password-btn" onClick={() => setShowPasswordModal(true)}>
              Cambiar contraseña
            </button>
          </div>
        </div>
        
        <div className="perfil-info">
          <div className="info-item">
            <span className="label">Clave:</span>
            <div className="value-with-action">
              <span className="value">{user.clave !== null && user.clave !== undefined ? user.clave : "No registrada"}</span>
              {(user.clave === null || user.clave === "") && (
                <button className="add-phone-btn" style={{ marginLeft: "117px" }} onClick={() => setShowClaveModal(true)}>
                  Añadir clave
                </button>
              )}
              {claveSuccess && <span className="success-message">{claveSuccess}</span>}
            </div>
          </div>
          <div className="info-item">
            <span className="label">Correo:</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Teléfono:</span>
            <div className="value-with-action">
              <span className="value">{user.telefono || "No registrado"}</span>
              <button className="add-phone-btn" onClick={() => setShowPhoneModal(true)}>
                {user.telefono ? "Editar teléfono" : "Añadir teléfono"}
              </button>
              {phoneSuccess && <span className="success-message">{phoneSuccess}</span>}
            </div>
          </div>
          <div className="info-item">
            <span className="label">Rol:</span>
            <span className="value">{user.rol}</span>
          </div>

          <div className="info-item">
            <span className="label">Ciclo Escolar:</span>
            <div className="perfil-ciclo-container">
              <CicloEscolarSelector
                value={user.ciclo_escolar || ''}
                onChange={async (value) => {
                  const success = await handleFieldUpdate('ciclo_escolar', value || null);
                  if (!success) alert("Error al actualizar ciclo escolar");
                }}
                className="perfil-ciclo-selector"
                showLabel={false}
                placeholder="Selecciona tu ciclo escolar"
              />
            </div>
          </div>
          
          <div className="info-item">
            <span className="label">Tipo de Movilidad:</span>
            <select
              className="perfil-select"
              value={user.tipo_movilidad || ''}
              onChange={async (e) => {
                const success = await handleFieldUpdate('tipo_movilidad', e.target.value || null);
                if (!success) alert("Error al actualizar tipo de movilidad");
              }}
            >
              <option value="">Sin tipo de movilidad</option>
              <option value="movilidad_internacional">Movilidad Internacional</option>
              <option value="movilidad_virtual">Movilidad Virtual</option>
              <option value="visitante_nacional">Visitante Nacional</option>
              <option value="visitante_internacional">Visitante Internacional</option>
            </select>
          </div>

          <div className="info-item">
            <span className="label">Universidad:</span>
            <select
              className="perfil-select"
              value={user.universidad_id || ''}
              onChange={async (e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                const success = await handleFieldUpdate('universidad_id', value);
                if (!success) alert("Error al actualizar universidad");
              }}
              disabled={universidades.length === 0}
            >
              <option value="">Selecciona tu universidad</option>
              {universidades.map(u => (
                <option key={u.id} value={u.id}>{u.nombre}</option>
              ))}
            </select>
          </div>

          <div className="info-item">
            <span className="label">Facultad:</span>
            <select
              className="perfil-select"
              value={user.facultad_id || ''}
              onChange={async (e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                const success = await handleFieldUpdate('facultad_id', value);
                if (!success) alert("Error al actualizar facultad");
              }}
              disabled={facultades.length === 0}
            >
              <option value="">Selecciona tu facultad</option>
              {facultades.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
          </div>

          <div className="info-item">
            <span className="label">Carrera:</span>
            <select
              className="perfil-select"
              value={user.carrera_id || ''}
              onChange={async (e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                const success = await handleFieldUpdate('carrera_id', value);
                if (!success) alert("Error al actualizar carrera");
              }}
              disabled={carreras.length === 0}
            >
              <option value="">Selecciona tu carrera</option>
              {carreras.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="info-item">
            <span className="label">Beca:</span>
            <select
              className="perfil-select"
              value={user.beca_id || ''}
              onChange={async (e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                const success = await handleFieldUpdate('beca_id', value);
                if (!success) alert("Error al actualizar beca");
              }}
              disabled={becas.length === 0}
            >
              <option value="">Selecciona tu beca</option>
              {becas.map(b => (
                <option key={b.id} value={b.id}>{b.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal modern-modal">
            <div className="modal-header">
              <h3 className="modal-title">Cambiar contraseña</h3>
              <button className="modal-close-btn" onClick={() => setShowPasswordModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="oldPassword">Contraseña actual</label>
                <input
                  id="oldPassword"
                  type="password"
                  placeholder="Contraseña actual"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="password-input"
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label htmlFor="newPassword">Nueva contraseña</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="password-input"
                />
              </div>
              {passwordError && <div className="error-message modal-error">{passwordError}</div>}
              {passwordSuccess && <div className="success-message modal-success">{passwordSuccess}</div>}
            </div>
            <div className="modal-footer">
              <button
                className="save-password-btn primary-btn"
                disabled={passwordLoading}
                onClick={handlePasswordChange}
              >
                {passwordLoading ? <span className="spinner"></span> : "Guardar"}
              </button>
              <button className="cancel-password-btn secondary-btn" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      
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
                <span className="label">Universidad destino:</span>
                <span className="value">{application.universidad}</span>
              </div>
              <div className="detail-item">
                <span className="label">Carrera:</span>
                <span className="value">{application.carrera}</span>
              </div>
              <div className="detail-item full-width">
                <span className="label">Materias de Interés:</span>
                <div className="materias-container">
                  {application.materiasinteres ? (
                    <MateriasSlider materias={application.materiasinteres} readOnly={true} />
                  ) : (
                    <span className="value">No hay materias seleccionadas</span>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <span className="label">Ciclo Escolar:</span>
                <span className="value">{application.cicloescolar}</span>
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
            </div>
          </div>
        ) : (
          <div className="no-application">
            <p>No has realizado ninguna solicitud de movilidad.</p>
          </div>
        )
      )}
      
      <div className="perfil-footer-space"></div>
      
      {showPhoneModal && (
        <div className="password-modal-overlay">
          <div className="password-modal modern-modal">
            <div className="modal-header">
              <h3 className="modal-title">Actualizar Teléfono</h3>
              <button className="modal-close-btn" onClick={() => setShowPhoneModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="newPhone">Número de Teléfono</label>
                <input
                  id="newPhone"
                  type="text"
                  placeholder="Ingrese su número telefónico"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  className="password-input"
                  autoFocus
                />
              </div>
              {phoneError && <div className="error-message modal-error">{phoneError}</div>}
              {phoneSuccess && <div className="success-message modal-success">{phoneSuccess}</div>}
            </div>
            <div className="modal-footer">
              <button
                className="save-password-btn primary-btn"
                disabled={phoneLoading}
                onClick={handlePhoneChange}
              >
                {phoneLoading ? <span className="spinner"></span> : "Guardar"}
              </button>
              <button className="cancel-password-btn secondary-btn" onClick={() => setShowPhoneModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showClaveModal && (
        <div className="password-modal-overlay">
          <div className="password-modal modern-modal">
            <div className="modal-header">
              <h3 className="modal-title">Añadir Clave</h3>
              <button className="modal-close-btn" onClick={() => setShowClaveModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label htmlFor="newClave">Clave del Estudiante</label>
                <input
                  id="newClave"
                  type="text"
                  placeholder="Ingrese su clave de estudiante (opcional)"
                  value={newClave}
                  onChange={e => setNewClave(e.target.value)}
                  className="password-input"
                  autoFocus
                />
              </div>
              {claveError && <div className="error-message modal-error">{claveError}</div>}
              {claveSuccess && <div className="success-message modal-success">{claveSuccess}</div>}
            </div>
            <div className="modal-footer">
              <button
                className="save-password-btn primary-btn"
                disabled={claveLoading}
                onClick={handleClaveChange}
              >
                {claveLoading ? <span className="spinner"></span> : "Guardar"}
              </button>
              <button className="cancel-password-btn secondary-btn" onClick={() => setShowClaveModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerfilPage;