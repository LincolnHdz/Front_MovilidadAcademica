import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../api/axiosConfig';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import AdminModalApplication from '../../components/AdminModalApplication/AdminModalApplication';
import StatsFilters from '../../components/Filter';
import './AdminApplicationsPage.css';
import '../../components/Filter.css';

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

  // Estado para mostrar/ocultar filtros
  const [showFiltros, setShowFiltros] = useState(false);

  // Estados para filtros
  const [filters, setFilters] = useState({
    facultad_id: '',
    carrera_id: '',
    universidad_id: '',
    beca_id: '',
    tipo_movilidad: '',
    ciclo_escolar_inicio: '',
    ciclo_escolar_final: ''
  });

  // Estados para opciones de filtros
  const [filterOptions, setFilterOptions] = useState({
    universidades: [],
    facultades: [],
    carreras: [],
    becas: [],
    tiposMovilidad: [],
    ciclosEscolares: []
  });

  // Cargar opciones de filtros al montar el componente
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [universidades, facultades, carreras, becas] = await Promise.all([
          api.get('/catalogo/universidades'),
          api.get('/catalogo/facultades'),
          api.get('/catalogo/carreras'),
          api.get('/catalogo/becas')
        ]);

        setFilterOptions({
          universidades: universidades.data?.data || [],
          facultades: facultades.data?.data || [],
          carreras: carreras.data?.data || [],
          becas: becas.data?.data || [],
          tiposMovilidad: [
            { id: 'movilidad_internacional', nombre: 'Movilidad Internacional' },
            { id: 'movilidad_virtual', nombre: 'Movilidad Virtual' },
            { id: 'visitante_nacional', nombre: 'Visitante Nacional' },
            { id: 'visitante_internacional', nombre: 'Visitante Internacional' }
          ],
          ciclosEscolares: [
            { id: '2023-2024', nombre: '2023-2024' },
            { id: '2024-2025', nombre: '2024-2025' },
            { id: '2025-2026', nombre: '2025-2026' }
          ]
        });
      } catch (error) {
        console.error('Error al cargar opciones de filtros:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Función para cargar las solicitudes desde la API con filtros
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

      // Construir query params con los filtros activos
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString 
        ? `/applications/admin/all?${queryString}` 
        : '/applications/admin/all';

      console.log('Fetching applications with URL:', url);

      const response = await api.get(url, config);
      
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

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      facultad_id: '',
      carrera_id: '',
      universidad_id: '',
      beca_id: '',
      tipo_movilidad: '',
      ciclo_escolar_inicio: '',
      ciclo_escolar_final: ''
    });
  };

  // Cargar solicitudes cuando cambian los filtros o el usuario
  useEffect(() => {
    if (user?.rol === 'administrador') {
      fetchApplications();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.rol, filters]);

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

        <button
          className="filter-button"
          onClick={() => setShowFiltros(!showFiltros)}
        >
          {showFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
      </div>

      {showFiltros && (
        <div className="advanced-filters-panel">
          <div className="filters-header">
            <h3>Filtros Avanzados</h3>
            <button className="clear-filters-button" onClick={clearFilters}>
              Limpiar Filtros
            </button>
          </div>
          <StatsFilters
            filters={filters}
            onFilterChange={setFilters}
            filterOptions={filterOptions}
          />
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