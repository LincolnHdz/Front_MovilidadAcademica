import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import StatsFilters from "../../components/Filter";
import { INITIAL_FILTERS } from "../../components/filterConstants";
import "./AdminUsersPage.css";
import "../../components/Filter.css";
import UserDetailsModal from "./UserDetailModal/UserDetailsModal";
import ImportUsersModal from "../../components/ImportUsersModal/ImportUsersModal";

// Constants
const USERS_PER_PAGE = 10;
const ROLES = ["alumno", "becario", "administrador"];
const TAB_FILTERS = {
  movilidad: ["movilidad_virtual", "movilidad_internacional"],
  visitantes: ["visitante_nacional", "visitante_internacional"],
};
const TABS = [
  { id: "todos", label: "Todos los usuarios" },
  { id: "movilidad", label: "Movilidad Virtual e Internacional" },
  { id: "visitantes", label: "Visitantes Nacionales e Internacionales" },
];

// Helper Components
const SkeletonRow = () => (
  <tr className="skeleton-row">
    <td><div className="skeleton skeleton-text skeleton-id"></div></td>
    <td><div className="skeleton skeleton-text skeleton-name"></div></td>
    <td><div className="skeleton skeleton-text skeleton-email"></div></td>
    <td><div className="skeleton skeleton-text skeleton-clave"></div></td>
    <td><div className="skeleton skeleton-badge"></div></td>
    <td><div className="skeleton skeleton-select"></div></td>
  </tr>
);

const AdminUsersPage = () => {
  const { user } = useAuth();
  
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showFiltros, setShowFiltros] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [filterOptions, setFilterOptions] = useState({
    universidades: [],
    facultades: [],
    carreras: [],
    becas: [],
    ciclosEscolares: [],
    tiposMovilidad: []
  });

  // API Calls
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await api.get("/users/all", config);

      const { data } = response;
      if (!data?.success) throw new Error(data?.message || "Error en la respuesta");

      setUsers(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const res = await api.get("/stats/filter-options", config);
      
      if (res.data?.success) {
        setFilterOptions(res.data.data);
      }
    } catch (e) {
      console.error("Error al cargar opciones de filtros:", e);
    }
  }, []);

  const handleChangeRole = useCallback(async (userId, rol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await api.patch(`/users/${userId}/rol`, { rol }, config);
      const { data } = response;
      if (!data.success) throw new Error(data.message || "Error");

      setUsers((prev) => prev.map((u) => (u.id === userId ? data.data : u)));
      setSuccessMessage(`Rol actualizado correctamente para ${data.data.nombres}`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      setError("No se pudo actualizar el rol: " + (e.response?.data?.message || e.message));
      setTimeout(() => setError(""), 5000);
    }
  }, []);

  // Filter Logic with useMemo
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    let filtered = users;

    // Apply tab-based filtering
    if (activeTab === "movilidad") {
      filtered = filtered.filter((u) => TAB_FILTERS.movilidad.includes(u.tipo_movilidad));
    } else if (activeTab === "visitantes") {
      filtered = filtered.filter((u) => TAB_FILTERS.visitantes.includes(u.tipo_movilidad));
    }

    // Apply advanced filters
    const filterKeys = [
      { key: 'universidad_id', parseValue: true },
      { key: 'facultad_id', parseValue: true },
      { key: 'carrera_id', parseValue: true },
      { key: 'beca_id', parseValue: true },
      { key: 'tipo_movilidad', parseValue: false },
      { key: 'ciclo_escolar_inicio', parseValue: false },
      { key: 'ciclo_escolar_final', parseValue: false },
    ];

    filterKeys.forEach(({ key, parseValue }) => {
      if (filters[key]) {
        filtered = filtered.filter((u) => {
          if (!u[key]) return false;
          return parseValue 
            ? u[key] === parseInt(filters[key])
            : u[key] === filters[key];
        });
      }
    });

    return filtered;
  }, [users, activeTab, filters]);

  // Pagination
  const { currentUsers, totalPages } = useMemo(() => {
    const indexOfLastUser = currentPage * USERS_PER_PAGE;
    const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    
    return { currentUsers, totalPages };
  }, [filteredUsers, currentPage]);

  // Role Statistics
  const roleStats = useMemo(() => {
    if (!Array.isArray(filteredUsers)) return { alumno: 0, becarios: 0, administrador: 0 };
    
    return {
      alumno: filteredUsers.filter((u) => u.rol === "alumno").length,
      becario: filteredUsers.filter((u) => u.rol === "becario").length,
      administrador: filteredUsers.filter((u) => u.rol === "administrador").length,
    };
  }, [filteredUsers]);

  // Effects
  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchUsers();
      fetchFilterOptions();
    } else {
      setLoading(false);
    }
  }, [user?.rol, fetchUsers, fetchFilterOptions]);

  useEffect(() => {
    if (showUserModal || showImportModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [showUserModal, showImportModal]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, activeTab]);

  // Event Handlers
  const handleRefresh = () => fetchUsers();
  
  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const handleUserDoubleClick = (user) => {
    setSelectedUser(user.id);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  const handleImportUsers = () => {
    setShowImportModal(true);
  };

  const handleImportSuccess = (results) => {
    if (results.successful > 0) {
      setSuccessMessage(`Se importaron ${results.successful} usuarios exitosamente`);
      setTimeout(() => setSuccessMessage(""), 5000);
      fetchUsers(); // Recargar la lista de usuarios
    }
    if (results.failed > 0) {
      setError(`${results.failed} usuarios no se pudieron importar. Revisa los detalles.`);
      setTimeout(() => setError(""), 5000);
    }
  };

  const closeImportModal = () => {
    setShowImportModal(false);
  };

  if (user?.rol !== "administrador") {
    return (
      <div className="access-denied">
        <h2>Acceso denegado</h2>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-page-header">
        <h1 className="admin-title">Administración de Usuarios</h1>

        <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "↻ Actualizar lista"}
        </button>

        <button
          className="import-button"
          onClick={handleImportUsers}
          title="Importar usuarios desde archivo"
        >
          Importar Usuarios
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

      <div className="tabs-container">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
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
      
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre completo</th>
              <th>Correo electrónico</th>
              <th>Clave</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {[...Array(8)].map((_, index) => (
                  <SkeletonRow key={index} />
                ))}
              </>
            ) : !Array.isArray(filteredUsers) ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No hay datos de usuarios disponibles
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No se encontraron usuarios en esta categoría
                </td>
              </tr>
            ) : (
              currentUsers.map((u) => (
                <tr
                  key={u.id}
                  onDoubleClick={() => handleUserDoubleClick(u)}
                  style={{ cursor: "pointer" }}
                  title="Doble click para ver detalles"
                >
                  <td>{u.id}</td>
                  <td>
                    <strong>
                      {u.nombres} {u.apellido_paterno} {u.apellido_materno || ""}
                    </strong>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.clave}</td>
                  <td>
                    <span className={`user-role role-${u.rol}`}>{u.rol}</span>
                  </td>
                  <td>
                    <div className="action-container">
                      <select
                        className="select-role"
                        value={u.rol}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        title="Cambiar rol de usuario"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <span className="pagination-info">
              Página {currentPage} de {totalPages}
            </span>

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles usando el componente */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          userId={selectedUser}
          onClose={closeUserModal} 
        />
      )}

      {/* Modal de importación de usuarios */}
      {showImportModal && (
        <ImportUsersModal
          onClose={closeImportModal}
          onSuccess={handleImportSuccess}
        />
      )}
      
      {loading ? (
        <div className="users-stats">
          <div className="skeleton skeleton-text skeleton-stat-title"></div>
          <div className="role-stats">
            <div className="skeleton skeleton-text skeleton-stat"></div>
            <div className="skeleton skeleton-text skeleton-stat"></div>
            <div className="skeleton skeleton-text skeleton-stat"></div>
          </div>
        </div>
      ) : (
        <div className="users-stats">
          <p className="total-users">
            <span>
              Total de usuarios {activeTab !== "todos" ? "filtrados" : ""}:
            </span>
            <strong>{filteredUsers.length}</strong>
          </p>
          {filteredUsers.length > 0 && (
            <div className="role-stats">
              <div className="role-stat">
                <span>Alumnos:</span>
                <strong>{roleStats.alumno}</strong>
              </div>
              <div className="role-stat">
                <span>Becarios:</span>
                <strong>{roleStats.becario}</strong>
              </div>
              <div className="role-stat">
                <span>Administradores:</span>
                <strong>{roleStats.administrador}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
