import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import { 
  Plus, Edit3, Trash2, Search, Save, X,
  University, BookOpen, Building, GraduationCap, Award,
  Edit,
  Delete
} from "lucide-react";
import "./CatalogoPage.css";

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
    columns: ["id", "nombre", "pais"]
  },
  facultades: {
    title: "Facultades", 
    icon: <Building size={20} />,
    endpoint: "facultades",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "universidad_id", label: "Universidad", type: "select", required: true }
    ],
    columns: ["id", "nombre", "universidad_nombre"]
  },
  carreras: {
    title: "Carreras",
    icon: <BookOpen size={20} />,
    endpoint: "carreras", 
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "facultad_id", label: "Facultad", type: "select", required: true }
    ],
    columns: ["id", "nombre", "facultad_nombre", "universidad_nombre"],
    filters: [
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
      { name: "facultad_id", label: "Facultad", type: "select", required: true },
      { name: "carrera_id", label: "Carrera", type: "select", required: true }
    ],
    columns: ["id", "nombre", "clave", "creditos", "carrera_nombre", "facultad_nombre"],
    filters: [
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
    columns: ["id", "nombre", "pais"]
  }
};

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

  // Datos para los selects
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [todasLasFacultades, setTodasLasFacultades] = useState([]);
  const [todasLasCarreras, setTodasLasCarreras] = useState([]);

  // Estados separados para filtros vs formularios
  const [facultadesFiltro, setFacultadesFiltro] = useState([]);
  const [carrerasFiltro, setCarrerasFiltro] = useState([]);

  // Resetear filtros
  const resetFilters = useCallback(() => {
    setFilters({});
    setSearchTerm("");
    setFacultadesFiltro([]);
    setCarrerasFiltro([]);
  }, []);

  // Cargar datos principales
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const config = catalogConfig[activeTab];
      if (!config) {
        setError("Configuración no encontrada para: " + activeTab);
        return;
      }
      
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
  }, [activeTab]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          loadUniversidades(),
          loadTodasLasFacultades(),
          loadTodasLasCarreras()
        ]);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
      }
    };
    
    loadInitialData();
  }, []);

  // Cargar datos cuando cambia la pestaña
  useEffect(() => {
    loadData();
    resetFilters();
    
    // Precargar datos para filtros según la pestaña activa
    if (activeTab === "materias" || activeTab === "carreras") {
      // Para filtros, usar todas las facultades
      setFacultadesFiltro(todasLasFacultades);
    }
    if (activeTab === "materias") {
      // Para filtros de materias, usar todas las carreras inicialmente
      setCarrerasFiltro(todasLasCarreras);
    }
  }, [activeTab, loadData, resetFilters, todasLasFacultades, todasLasCarreras]);

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

  // Cargar todas las facultades (para formularios)
  const loadTodasLasFacultades = async () => {
    try {
      const response = await api.get("/catalogo/facultades");
      if (response.data.success) {
        setTodasLasFacultades(response.data.data);
        setFacultades(response.data.data); // Para formularios
      }
    } catch (error) {
      console.error("Error cargando todas las facultades:", error);
    }
  };

  // Cargar todas las carreras (para formularios)
  const loadTodasLasCarreras = async () => {
    try {
      const response = await api.get("/catalogo/carreras");
      if (response.data.success) {
        setTodasLasCarreras(response.data.data);
        setCarreras(response.data.data); // Para formularios
      }
    } catch (error) {
      console.error("Error cargando todas las carreras:", error);
    }
  };

  // Cargar carreras filtradas por facultad (para formularios)
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

  // Manejar cambios en filtros - CORREGIDO
  const handleFilterChange = async (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    
    // Para materias: manejar dependencias de filtros
    if (activeTab === "materias") {
      if (filterName === "facultad_id") {
        newFilters.carrera_id = ""; // Resetear carrera cuando cambia facultad
        
        if (value) {
          // Filtrar carreras por la facultad seleccionada para el FILTRO
          const carrerasFiltradas = todasLasCarreras.filter(c => c.facultad_id == value);
          setCarrerasFiltro(carrerasFiltradas);
        } else {
          // Si no hay facultad seleccionada, mostrar todas las carreras en el FILTRO
          setCarrerasFiltro(todasLasCarreras);
        }
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
      if (!value || value === "") return true;
      
      // Para materias, verificar la estructura correcta de los datos
      if (activeTab === "materias") {
        if (key === "facultad_id") {
          return item.facultad_id == value;
        }
        if (key === "carrera_id") {
          return item.carrera_id == value;
        }
      }
      
      // Para otros catálogos
      return item[key] == value;
    });

    return matchesSearch && matchesFilters;
  });

  // Abrir modal para crear/editar - CORREGIDO
  const openModal = async (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({ ...item });
      
      // Para materias, cargar dependencias del FORMULARIO
      if (activeTab === "materias") {
        if (item.facultad_id) {
          await loadCarrerasByFacultad(item.facultad_id);
        }
      }
      // Para carreras, cargar dependencias del FORMULARIO
      else if (activeTab === "carreras") {
        if (item.facultad_id) {
          // Para carreras en formulario, ya tenemos todas las facultades cargadas
          // No necesitamos cargar nada adicional
        }
      }
    } else {
      const config = catalogConfig[activeTab];
      const initialData = {};
      config.fields.forEach(field => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
      
      // Para nuevo registro en materias, asegurar que carreras esté vacío inicialmente en FORMULARIO
      if (activeTab === "materias") {
        setCarreras([]);
      }
    }
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  // Manejar cambios en el formulario - CORREGIDO
  const handleFormChange = async (name, value) => {
    const newFormData = { ...formData, [name]: value };
    
    // Para materias: manejar dependencias en FORMULARIO
    if (activeTab === "materias") {
      if (name === "facultad_id") {
        newFormData.carrera_id = ""; // Resetear carrera cuando cambia facultad
        if (value) {
          await loadCarrerasByFacultad(value);
        } else {
          setCarreras([]);
        }
      }
    }
    
    setFormData(newFormData);
  };

  // Guardar item
  const saveItem = async () => {
    try {
      const config = catalogConfig[activeTab];
      let response;
      
      // Validar datos requeridos
      const requiredFields = config.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.name]);
      
      if (missingFields.length > 0) {
        setError("Por favor completa todos los campos requeridos");
        return;
      }
      
      if (editingItem) {
        response = await api.put(`/catalogo/${config.endpoint}/${editingItem.id}`, formData);
      } else {
        const dataToSend = { ...formData };
        delete dataToSend.id;
        
        // Para materias, asegurar que los datos sean consistentes
        if (activeTab === "materias") {
          // Verificar que no exista una materia con la misma clave y carrera
          const materiaExistente = items.find(item => 
            item.clave === dataToSend.clave && 
            item.carrera_id == dataToSend.carrera_id
          );
          
          if (materiaExistente) {
            setError("Ya existe una materia con esta clave en la carrera seleccionada");
            return;
          }
        }
        
        // Para becas, verificar que no exista una beca con el mismo nombre y país
        if (activeTab === "becas") {
          const becaExistente = items.find(item => 
            item.nombre.toLowerCase() === dataToSend.nombre.toLowerCase() && 
            item.pais.toLowerCase() === dataToSend.pais.toLowerCase()
          );
          
          if (becaExistente) {
            setError("Ya existe una beca con este nombre en el mismo país");
            return;
          }
        }
        
        response = await api.post(`/catalogo/${config.endpoint}`, dataToSend);
      }
      
      if (response.data.success) {
        closeModal();
        await loadData();
        
        // Actualizar listas dependientes
        if (activeTab === "universidades") {
          await loadUniversidades();
        } else if (activeTab === "facultades") {
          await loadTodasLasFacultades();
        } else if (activeTab === "carreras") {
          await loadTodasLasCarreras();
        }
        
        setError(null); // Limpiar error en éxito
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("duplicate key") || errorMessage.includes("ya existe")) {
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
      }
    } catch (error) {
      setError("Error al eliminar: " + (error.response?.data?.message || error.message));
    }
  };

  // Función helper para formatear headers de columnas
  const formatColumnHeader = (column) => {
    const headers = {
      id: "ID",
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

      {/* Filtros y búsqueda - CORREGIDO */}
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

        {/* Filtros jerárquicos - COMPLETAMENTE CORREGIDO */}
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
                  {filter.options === "facultades" && 
                    // Para FILTROS, usar facultadesFiltro
                    facultadesFiltro.map(item => (
                      <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))
                  }
                  {filter.options === "carreras" && 
                    // Para FILTROS, usar carrerasFiltro
                    carrerasFiltro.map(item => (
                      <option key={item.id} value={item.id}>{item.nombre}</option>
                    ))
                  }
                </select>
              </div>
            ))}
          </div>
        )}

        <button className="btn-primary" onClick={() => openModal()}>
          <Plus size={20} />
          Agregar
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button 
            onClick={() => setError(null)} 
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

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
                {Object.values(filters).some(f => f) && " que coincidan con los filtros aplicados"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de formulario - COMPLETAMENTE CORREGIDO */}
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
                      {field.name === "universidad_id" && 
                        // Para FORMULARIO de universidades
                        universidades.map(item => (
                          <option key={item.id} value={item.id}>{item.nombre}</option>
                        ))
                      }
                      {field.name === "facultad_id" && 
                        // Para FORMULARIO, usar facultades (todas las facultades)
                        facultades.map(item => (
                          <option key={item.id} value={item.id}>{item.nombre}</option>
                        ))
                      }
                      {field.name === "carrera_id" && 
                        // Para FORMULARIO, usar carreras (pueden estar filtradas por facultad en materias)
                        carreras.map(item => (
                          <option key={item.id} value={item.id}>{item.nombre}</option>
                        ))
                      }
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