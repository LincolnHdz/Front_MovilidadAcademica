import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../api/axiosConfig';
import './AdminApplicationsPage.css';

const AdminApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeApplication, setActiveApplication] = useState(null);
  const [statusForm, setStatusForm] = useState({
    estado: '',
    comentarios: ''
  });

  // Cargar todas las solicitudes cuando el componente se monta
  useEffect(() => {
    if (user?.rol === 'administrador') {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user?.rol]);

  // Función para cargar las solicitudes desde la API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

  const response = await api.get('/applications/admin/all', config);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al cargar solicitudes');
      }

      setApplications(response.data.data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el estado de una solicitud
  const updateApplicationStatus = async (id, formData) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Asegurarse de enviar un objeto plano JSON
      const plainBody = {
        estado: formData.estado,
        comentarios: formData.comentarios
      };
      const response = await api.patch(`/applications/${id}/status`, plainBody, config);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al actualizar solicitud');
      }

      // Actualizar la lista de solicitudes
      setApplications(prev => 
        prev.map(app => app.id === id ? response.data.data : app)
      );
      
      setSuccessMessage('Estado actualizado correctamente');
      setActiveApplication(null);
      setStatusForm({ estado: '', comentarios: '' });
      
      // Opcionalmente, volver a cargar todas las solicitudes para asegurar datos completos
      // Esto garantiza que tengamos todos los datos actualizados
      fetchApplications();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      setError(error.response?.data?.message || error.message || 'Error de conexión');
    }
  };

  // Función para manejar el cambio de estado
  const handleStatusChange = (e) => {
    setStatusForm({
      ...statusForm,
      [e.target.name]: e.target.value
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeApplication) {
      updateApplicationStatus(activeApplication.id, statusForm);
    }
  };

  // Si el usuario no es administrador, mostrar mensaje de acceso denegado
  if (user?.rol !== 'administrador') {
    return (
      <div className="access-denied">
        <h2>Acceso denegado</h2>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div className="admin-applications-container">
      <div className="admin-page-header">
        <h1 className="admin-title">Solicitudes de Registro</h1>
        <button className="refresh-button" onClick={fetchApplications} disabled={loading}>
          {loading ? 'Actualizando...' : '↻ Actualizar lista'}
        </button>
      </div>

      {loading && (
        <div className="loading-spinner">
          <div>Cargando solicitudes...</div>
        </div>
      )}

      {error && (
        <div className="status-message error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="status-message success-message">
          <strong>Éxito:</strong> {successMessage}
        </div>
      )}

      {!loading && !error && (
        <>
          {applications.length === 0 ? (
            <div className="no-applications">
              <p>No hay solicitudes de registro pendientes.</p>
            </div>
          ) : (
            <div className="applications-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', alignItems: 'center', width: '100%' }}>
              {applications.map(app => (
                <div
                  key={app.id}
                  className={`application-card ${app.estado}`}
                  style={{
                    borderLeft: `8px solid ${app.estado === 'aceptada' ? '#2e7d32' : app.estado === 'rechazada' ? '#c62828' : '#3498db'}`,
                    background: 'linear-gradient(90deg, #eaf6fb 60%, #d6eaf8 100%)',
                    boxShadow: '0 2px 12px rgba(44,62,80,0.10)',
                    borderRadius: 18,
                    margin: 0,
                    padding: '1.4rem 2.5rem 1.4rem 2rem',
                    minWidth: 400,
                    maxWidth: 1000,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '2.5rem',
                  }}
                  onClick={() => {
                    setActiveApplication(app);
                    setStatusForm({
                      estado: ['en_revision', 'aceptada', 'rechazada'].includes(app.estado) ? app.estado : 'en_revision',
                      comentarios: app.comentarios || ''
                    });
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div className="application-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ color: '#21618c', margin: 0, fontWeight: 700, letterSpacing: 0.5 }}>{app.nombres} {app.apellido_paterno} {app.apellido_materno}</h3>
                      <span className={`status-badge ${app.estado}`} style={{ fontWeight: 700, fontSize: '1rem', borderRadius: 16, padding: '0.3rem 1.2rem', background: app.estado === 'aceptada' ? '#2e7d32' : app.estado === 'rechazada' ? '#c62828' : '#3498db', color: '#fff', boxShadow: '0 2px 8px rgba(44,62,80,0.07)' }}>
                        {app.estado === 'en_revision' && 'En Revisión'}
                        {app.estado === 'aceptada' && 'Aceptada'}
                        {app.estado === 'rechazada' && 'Rechazada'}
                      </span>
                    </div>
                    <div className="application-info" style={{ marginTop: '1rem', color: '#34495e', fontSize: '1.05rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem 2rem' }}>
                        <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Clave:</strong> 
                            <span style={{ color: '#273746', fontWeight: 600 }}>{app.user_clave}</span>
                          </p>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Email:</strong> 
                            <span style={{ color: '#273746' }}>{app.email}</span>
                          </p>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Facultad:</strong> 
                            <span style={{ color: '#273746' }}>{app.universidad}</span>
                          </p>
                        </div>
                        <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '120px' }}>Carrera:</strong> 
                            <span style={{ color: '#273746' }}>{app.carrera}</span>
                          </p>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '120px' }}>Materia:</strong> 
                            <span style={{ color: '#273746' }}>{app.materia}</span>
                          </p>
                          <p style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2980b9', display: 'inline-block', width: '120px' }}>Ciclo Escolar:</strong> 
                            <span style={{ color: '#273746' }}>{app.cicloescolar}</span>
                          </p>
                        </div>
                      </div>
                      {/* Mostrar enlace al archivo subido si existe */}
                      {(() => {
                        let archivo = app.archivo;
                        if (archivo && typeof archivo === 'string') {
                          try {
                            archivo = JSON.parse(archivo);
                          } catch { archivo = null; }
                        }
                        return archivo && archivo.filename ? (
                          <div style={{ margin: '0.7rem 0' }}>
                            <a
                              href={`http://localhost:3000/download/${archivo.filename}`}
                              download={archivo.originalname || archivo.filename}
                              style={{ 
                                display: 'inline-block',
                                color: '#fff', 
                                background: '#004A98',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                textDecoration: 'none', 
                                fontWeight: 600, 
                                fontSize: '0.95rem',
                                marginTop: '0.5rem',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                              }}
                            >
                              Ver/Descargar archivo
                            </a>
                          </div>
                        ) : null;
                      })()}
                    </div>
                    {app.comentarios && (
                      <div className="application-comments" style={{ background: '#f8f9fa', borderRadius: 8, padding: '0.7rem 1.2rem', marginTop: '0.7rem', color: '#7f8c8d', borderLeft: '4px solid #3498db' }}>
                        <p style={{ margin: 0 }}><strong>Comentarios:</strong> {app.comentarios}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="applications-stats">
            <p><strong>Total solicitudes:</strong> {applications.length}</p>
            <p><strong>Pendientes:</strong> {applications.filter(app => app.estado === 'pendiente').length}</p>
            <p><strong>En revisión:</strong> {applications.filter(app => app.estado === 'en_revision').length}</p>
            <p><strong>Aceptadas:</strong> {applications.filter(app => app.estado === 'aceptada').length}</p>
            <p><strong>Rechazadas:</strong> {applications.filter(app => app.estado === 'rechazada').length}</p>
          </div>
        </>
      )}

      {/* Modal para actualizar el estado de una solicitud */}
      {activeApplication && (
        <div className="modal-overlay" style={{ background: 'rgba(41, 128, 185, 0.18)', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'linear-gradient(120deg, #eaf6fb 80%, #d6eaf8 100%)', borderRadius: 18, boxShadow: '0 6px 32px rgba(44,62,80,0.18)', padding: '2.2rem', maxWidth: 440, border: '1.5px solid #3498db' }}>
            <h2 style={{ color: '#21618c', marginBottom: 8, fontWeight: 700 }}>Actualizar Estado de Solicitud</h2>
            <h3 style={{ color: '#34495e', marginBottom: 18 }}>{activeApplication.nombres} {activeApplication.apellido_paterno} {activeApplication.apellido_materno}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label htmlFor="estado" style={{ color: '#2980b9', fontWeight: 600 }}>Estado:</label>
                <select 
                  id="estado"
                  name="estado"
                  value={statusForm.estado}
                  onChange={handleStatusChange}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1.5px solid #85c1e9', marginTop: 4, background: '#fff', color: '#21618c', fontWeight: 500 }}
                >
                  <option value="">Seleccionar estado</option>
                  <option value="en_revision">En Revisión</option>
                  <option value="aceptada">Aceptada</option>
                  <option value="rechazada">Rechazada</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 18 }}>
                <label htmlFor="comentarios" style={{ color: '#2980b9', fontWeight: 600 }}>Comentarios:</label>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  value={statusForm.comentarios}
                  onChange={handleStatusChange}
                  rows={4}
                  placeholder="Añade comentarios para el solicitante..."
                  style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1.5px solid #85c1e9', marginTop: 4, background: '#fff', color: '#21618c', fontWeight: 500 }}
                ></textarea>
              </div>
              <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
                <button type="button" onClick={() => setActiveApplication(null)} className="cancel-button" style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(198,40,40,0.08)' }}>
                  Cancelar
                </button>
                <button type="submit" className="submit-button" style={{ background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(57,73,171,0.08)' }}>
                  Actualizar Estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;