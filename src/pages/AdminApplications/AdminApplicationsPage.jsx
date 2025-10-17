import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../api/axiosConfig';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import AdminModalApplication from '../../components/AdminModalApplication/AdminModalApplication';
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
            <div className="applications-grid admin-cards-container">
              {applications.map(app => (
                <div className="admin-card-wrapper">
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    isAdminView={true}
                    showStatus={true}
                    onApplicationClick={(application) => {
                      setActiveApplication(application);
                      setStatusForm({
                        estado: ['en_revision', 'aceptada', 'rechazada'].includes(application.estado) ? application.estado : 'en_revision',
                        comentarios: application.comentarios || ''
                      });
                    }}
                  />
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
      <AdminModalApplication
        application={activeApplication}
        statusForm={statusForm}
        onClose={() => setActiveApplication(null)}
        onSubmit={handleSubmit}
        onChange={handleStatusChange}
        isVisible={!!activeApplication}
      />
    </div>
  );
};

export default AdminApplicationsPage;