import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import { 
  Plus, Edit3, Trash2, Search, Save, X,
  University, BookOpen, Building, GraduationCap, Award,
  Edit,
  Delete
} from "lucide-react";
import "./CatalogoPage.css";

const CatalogoPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("universidades");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Datos para los selects (dependencias jerárquicas)
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);

  // Configuración para cada tipo de catálogo
  const catalogConfig = {
    universidades: {
      title: "Universidades",
      icon: <University size={20} />,
      endpoint: "universidades",
      fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "pais", label: "País", type: "text", required: true }
      ],
      columns: ["nombre", "pais"]
    },
    facultades: {
      title: "Facultades", 
      icon: <Building size={20} />,
      endpoint: "facultades",
      fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "universidad_id", label: "Universidad", type: "select", required: true }
      ],
      columns: ["nombre", "universidad_nombre"],
      filters: [
        { name: "universidad_id", label: "Universidad", type: "select", options: "universidades" }
      ]
    },
    carreras: {
      title: "Carreras",
      icon: <BookOpen size={20} />,
      endpoint: "carreras", 
      fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "facultad_id", label: "Facultad", type: "select", required: true }
      ],
      columns: ["nombre", "facultad_nombre", "universidad_nombre"],
      filters: [
        { name: "universidad_id", label: "Universidad", type: "select", options: "universidades" },
        { name: "facultad_id", label: "Facultad", type: "select", options: "facultades" }
      ]
    },
    materias: {
      title: "Materias",
      icon: <GraduationCap size={20} />,
      endpoint: "materias",
      fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "clave", label: "Clave", type: "text", required: true },
        { name: "creditos", label: "Créditos", type: "number", required: true },
        { name: "universidad_id", label: "Universidad", type: "select", required: true },
        { name: "facultad_id", label: "Facultad", type: "select", required: true },
        { name: "carrera_id", label: "Carrera", type: "select", required: true }
      ],
      columns: ["nombre", "clave", "creditos", "carrera_nombre", "facultad_nombre", "universidad_nombre"],
      filters: [
        { name: "universidad_id", label: "Universidad", type: "select", options: "universidades" },
        { name: "facultad_id", label: "Facultad", type: "select", options: "facultades" },
        { name: "carrera_id", label: "Carrera", type: "select", options: "carreras" }
      ]
    },
    becas: {
      title: "Becas",
      icon: <Award size={20} />,
      endpoint: "becas",
      fields: [
        { name: "nombre", label: "Nombre de la Beca", type: "text", required: true },
        { name: "pais", label: "País", type: "text", required: true }
      ],
      columns: ["nombre", "pais"]
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadUniversidades();
  }, []);

  // Cargar datos cuando cambia la pestaña
  useEffect(() => {
    loadData();
    resetFilters();
  }, [activeTab]);

  // Cargar universidades
  const loadUniversidades = async () => {
    try {
      const response = await api.get("/catalogo/universidades");
      if (response.data.success) {
        setUniversidades(response.data.data);
      }
    } catch (error) {
      console.error("Error cargando universidades:", error);
    }
  };

  // Cargar facultades filtradas por universidad
  const loadFacultadesByUniversidad = async (universidadId) => {
    try {
      const response = await api.get(`/catalogo/universidades/${universidadId}/facultades`);
      if (response.data.success) {
        setFacultades(response.data.data);
      }
    } catch (error) {
      console.error("Error cargando facultades:", error);
      setFacultades([]);
    }
  };

  // Cargar carreras filtradas por facultad
  const loadCarrerasByFacultad = async (facultadId) => {
    try {
      const response = await api.get(`/catalogo/facultades/${facultadId}/carreras`);
      if (response.data.success) {
        setCarreras(response.data.data);
      }
    } catch (error) {
      console.error("Error cargando carreras:", error);
      setCarreras([]);
    }
  };

  // Cargar datos principales
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = catalogConfig[activeTab];
      const response = await api.get(`/catalogo/${config.endpoint}`);
      if (response.data.success) {
        setItems(response.data.data);
      } else {
        setError("Error al cargar datos");
      }
    } catch (error) {
      setError("Error al cargar datos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setFacultades([]);
    setCarreras([]);
  };

  // Manejar cambios en filtros
  const handleFilterChange = async (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    
    // Si cambia universidad, resetear facultades y carreras
    if (filterName === "universidad_id") {
      newFilters.facultad_id = "";
      newFilters.carrera_id = "";
      setFacultades([]);
      setCarreras([]);
      if (value) {
        await loadFacultadesByUniversidad(value);
      }
    }
    
    // Si cambia facultad, resetear carreras
    if (filterName === "facultad_id") {
      newFilters.carrera_id = "";
      setCarreras([]);
      if (value) {
        await loadCarrerasByFacultad(value);
      }
    }
    
    setFilters(newFilters);
  };

  // Filtrar items basado en búsqueda y filtros
  const filteredItems = items.filter(item => {
    // Filtro por texto de búsqueda
    const matchesSearch = !searchTerm || 
      Object.values(item).some(value => 
        value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Filtros específicos
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return item[key] == value;
    });

    return matchesSearch && matchesFilters;
  });

  // Abrir modal para crear/editar
  const openModal = async (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
      // Para materias, necesitamos cargar la jerarquía completa
      if (activeTab === "materias") {
        if (item.universidad_id) {
          await loadFacultadesByUniversidad(item.universidad_id);
          if (item.facultad_id) {
            await loadCarrerasByFacultad(item.facultad_id);
          }
        }
      }
      // Para carreras, necesitamos universidad y facultad
      else if (activeTab === "carreras") {
        if (item.universidad_id) {
          await loadFacultadesByUniversidad(item.universidad_id);
        }
      }
      // Para facultades, solo necesitamos universidad
      else if (activeTab === "facultades") {
        if (item.universidad_id) {
          await loadFacultadesByUniversidad(item.universidad_id);
        }
      }
    } else {
      const config = catalogConfig[activeTab];
      const initialData = {};
      config.fields.forEach(field => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
    }
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  // Manejar cambios en el formulario
  const handleFormChange = async (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Manejar dependencias jerárquicas en el formulario
    if (name === "universidad_id") {
      setFormData(prev => ({ ...prev, facultad_id: "", carrera_id: "" }));
      setFacultades([]);
      setCarreras([]);
      if (value) {
        await loadFacultadesByUniversidad(value);
      }
    }
    
    if (name === "facultad_id") {
      setFormData(prev => ({ ...prev, carrera_id: "" }));
      setCarreras([]);
      if (value) {
        await loadCarrerasByFacultad(value);
      }
    }
  };

  // Guardar item
  const saveItem = async () => {
    try {
      const config = catalogConfig[activeTab];
      let response;
      
      if (editingItem) {
        // Si estamos editando, enviamos todos los datos incluyendo el ID
        response = await api.put(`/catalogo/${config.endpoint}/${editingItem.id}`, formData);
      } else {
        // Si estamos creando, eliminamos el ID del formData si existe
        const dataToSend = { ...formData };
        delete dataToSend.id; // Eliminamos el ID para evitar conflictos
        response = await api.post(`/catalogo/${config.endpoint}`, dataToSend);
      }
      
      if (response.data.success) {
        closeModal();
        await loadData();
        // Actualizar listas de opciones si es necesario
        if (activeTab === "universidades") {
          await loadUniversidades();
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("duplicate key")) {
        setError("Ya existe un registro con estos datos. Por favor, verifica la información.");
      } else {
        setError("Error al guardar: " + errorMessage);
      }
    }
  };

  // Confirmar eliminación
  const confirmDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Eliminar item
  const deleteItem = async () => {
    try {
      const config = catalogConfig[activeTab];
      const response = await api.delete(`/catalogo/${config.endpoint}/${itemToDelete.id}`);
      
      if (response.data.success) {
        setShowDeleteConfirm(false);
        setItemToDelete(null);
        await loadData();
        // Actualizar listas de opciones si es necesario
        if (activeTab === "universidades") {
          await loadUniversidades();
        }
      }
    } catch (error) {
      setError("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  // Función helper para formatear headers de columnas
  const formatColumnHeader = (column) => {
    const headers = {
      nombre: "Nombre",
      pais: "País",
      universidad_nombre: "Universidad",
      facultad_nombre: "Facultad", 
      carrera_nombre: "Carrera",
      clave: "Clave",
      creditos: "Créditos"
    };
    return headers[column] || column.charAt(0).toUpperCase() + column.slice(1);
  };

  const currentConfig = catalogConfig[activeTab];

  if (!user || user.rol !== "administrador") {
    return (
      <div className="catalogo-page">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="catalogo-page page-container">
      <div className="catalogo-header">
        <h1>Gestión de Catálogos</h1>
        <p>Administra universidades, facultades, carreras y materias</p>
      </div>

      {/* Tabs */}
      <div className="catalog-tabs">
        {Object.entries(catalogConfig).map(([key, config]) => (
          <button
            key={key}
            className={`tab-btn ${activeTab === key ? "active" : ""}`}
            onClick={() => setActiveTab(key)}
          >
            {config.icon}
            {config.title}
          </button>
        ))}
      </div>

      {/* Filtros y búsqueda */}
      <div className="catalog-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder={`Buscar ${currentConfig.title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtros jerárquicos */}
        {currentConfig.filters && (
          <div className="filters-section">
            {currentConfig.filters.map((filter) => (
              <div key={filter.name} className="filter-group">
                <label>{filter.label}:</label>
                <select
                  value={filters[filter.name] || ""}
                  onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                >
                  <option value="">Todos</option>
                  {filter.options === "universidades" && universidades.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                  {filter.options === "facultades" && facultades.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                  {filter.options === "carreras" && carreras.map(item => (
                    <option key={item.id} value={item.id}>{item.nombre}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Agregar {currentConfig.title.slice(0, -1)}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Tabla de datos */}
      <div className="catalog-content">
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  {currentConfig.columns.map(column => (
                    <th key={column}>{formatColumnHeader(column)}</th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    {currentConfig.columns.map(column => (
                      <td key={column}>{item[column] || "-"}</td>
                    ))}
                    <td className="actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(item)}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => confirmDelete(item)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="no-data">
                No hay {currentConfig.title.toLowerCase()} disponibles
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {editingItem ? "Editar" : "Agregar"} {currentConfig.title.slice(0, -1)}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {currentConfig.fields.map(field => (
                <div key={field.name} className="form-group">
                  <label>
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>
                  
                  {field.type === "select" ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      required={field.required}
                    >
                      <option value="">Seleccionar...</option>
                      {field.name === "universidad_id" && universidades.map(item => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                      ))}
                      {field.name === "facultad_id" && facultades.map(item => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                      ))}
                      {field.name === "carrera_id" && carreras.map(item => (
                        <option key={item.id} value={item.id}>{item.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFormChange(field.name, e.target.value)}
                      required={field.required}
                      placeholder={`Ingrese ${field.label.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={saveItem}>
                <Save size={20} />
                {editingItem ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>
                ¿Estás seguro de que deseas eliminar "{itemToDelete?.nombre}"?
                Esta acción no se puede deshacer y puede afectar registros relacionados.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancelar
              </button>
              <button className="btn-danger" onClick={deleteItem}>
                <Trash2 size={20} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoPage;