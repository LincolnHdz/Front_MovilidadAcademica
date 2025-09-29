import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/useAuth";
import "./ApplicationPage.css";
import MateriasSlider from "../../components/MateriasSlider";
import {
  Upload,
  FileText,
  X,
  Send,
  User,
  BookOpen,
  CheckCircle,
  Search,
  Filter,
  GraduationCap,
  Building2,
  ChevronLeft,
  ChevronRight,
  Hash,
  Calendar,
  AlertCircle
} from "lucide-react";

const RegistroMateria = () => {
  const { user } = useAuth();
  console.log("Usuario desde useAuth:", user);
  
  // Si el usuario no está cargado en el contexto, intentamos cargarlo desde localStorage
  useEffect(() => {
    if (!user) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          console.log("Usuario cargado desde localStorage:", parsedUser);
          // Aquí podrías actualizar el contexto si es necesario
        } catch (e) {
          console.error("Error al parsear userData de localStorage", e);
        }
      }
    }
  }, [user]);
  
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    clave: "",
    cicloEscolar: "",
    carrera: "",
    universidad: "", // Añadiendo universidad que faltaba
    materiasInteres: [],
    archivo: null,
  });
  const [materias, setMaterias] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [existingApplication, setExistingApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({general: ""});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [dragActive, setDragActive] = useState(false);
  const [showMateriasModal, setShowMateriasModal] = useState(false);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarreraFilter, setSelectedCarreraFilter] = useState("");
  
  // El sliderRef ya no es necesario porque se usa el componente MateriasSlider
  
  // Generar opciones de ciclos escolares dinámicamente
  const generateCiclosEscolares = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() devuelve 0-11
    
    const ciclos = [];
    
    // Determinar el año base del ciclo actual
    // Si estamos en enero-julio, el ciclo actual comenzó el año anterior
    // Si estamos en agosto-diciembre, el ciclo actual comenzó este año
    let currentCycleStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
    
    // Generar ciclos desde 2 años atrás hasta 2 años adelante
    for (let yearOffset = -2; yearOffset <= 2; yearOffset++) {
      const startYear = currentCycleStartYear + yearOffset;
      const endYear = startYear + 1;
      
      // Para el ciclo actual, determinar qué semestres mostrar
      if (yearOffset === 0) {
        // Ciclo actual - mostrar siempre ambos semestres
        ciclos.push({
          value: `${startYear}-${endYear}/I`,
          label: `${startYear}-${endYear}/I`
        });
        
        // Siempre mostrar el segundo semestre para el ciclo actual
        ciclos.push({
          value: `${startYear}-${endYear}/II`,
          label: `${startYear}-${endYear}/II`
        });
      } else if (yearOffset < 0) {
        // Ciclos pasados - mostrar ambos semestres
        ciclos.push({
          value: `${startYear}-${endYear}/I`,
          label: `${startYear}-${endYear}/I`
        });
        ciclos.push({
          value: `${startYear}-${endYear}/II`, 
          label: `${startYear}-${endYear}/II`
        });
      } else {
        // Ciclos futuros - mostrar ambos semestres
        ciclos.push({
          value: `${startYear}-${endYear}/I`,
          label: `${startYear}-${endYear}/I`
        });
        ciclos.push({
          value: `${startYear}-${endYear}/II`, 
          label: `${startYear}-${endYear}/II`
        });
      }
    }
    
    // Ordenar del más reciente al más antiguo
    return ciclos.reverse();
  };

  // Verificar si el usuario ya tiene una solicitud existente
  useEffect(() => {
    const checkExistingApplication = async () => {
      try {
        if (user && user.clave) {
          setLoading(true);
          const response = await api.get(`/applications/all`);
          
          if (response.data && response.data.success) {
            const userApplication = response.data.data.find(
              (app) => app.clave === user.clave
            );
            
            if (userApplication) {
              console.log("Usuario ya tiene solicitud existente:", userApplication);
              setExistingApplication(userApplication);
              
              // Opcional: Redirigir o mostrar mensaje
              // window.location.href = '/perfil';
            }
          }
        }
      } catch (error) {
        console.error("Error al verificar solicitud existente:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingApplication();
  }, [user]);

  // Inicializar datos del formulario con la información del usuario
  // Cargar catálogo de carreras y materias
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        // Cargar carreras
        const responseCarreras = await api.get('/catalogo/carreras');
        if (responseCarreras.data && responseCarreras.data.success) {
          console.log("Carreras cargadas:", responseCarreras.data.data);
          setCarreras(responseCarreras.data.data || []);
        }
        
        // Cargar materias
        const responseMaterias = await api.get('/catalogo/materias');
        if (responseMaterias.data && responseMaterias.data.success) {
          console.log("Materias cargadas:", responseMaterias.data.data);
          
          // Añadir información de carrera a cada materia si está disponible
          const materiasConCarrera = responseMaterias.data.data.map(materia => ({
            ...materia,
            carreraNombre: materia.carrera_id 
              ? responseCarreras.data.data.find(c => c.id === materia.carrera_id)?.nombre || 'Carrera no especificada'
              : 'Carrera no especificada'
          }));
          
          setMaterias(materiasConCarrera || []);
          setFilteredMaterias(materiasConCarrera || []);
        }
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      }
    };
    
    fetchCatalogos();
  }, []);
  
  useEffect(() => {
    if (user) {
      console.log("Datos del usuario:", user);
      
      // Función para obtener el nombre de la carrera
      const getNombreCarrera = (carreraId) => {
        if (!carreraId || !carreras.length) return "No especificada";
        const carrera = carreras.find(c => c.id === Number(carreraId));
        return carrera ? carrera.nombre : "No especificada";
      };
      
      // Llenamos el formulario con los datos del usuario usando los nombres de propiedades correctos
      setFormData((prev) => ({
        ...prev,
        nombre: user.nombres || "",
        apellidoMaterno: user.apellido_materno || "",
        apellidoPaterno: user.apellido_paterno || "",
        clave: user.clave || "",
        carrera: user.carrera_id ? getNombreCarrera(user.carrera_id) : "",
      }));
      
      // Inicializar materias como array vacío
      setMaterias([]);
      console.log("Esperando materias del administrador");
    } else {
      console.warn("No hay datos de usuario disponibles");
    }
  }, [user, carreras]);

  // Función para filtrar materias según búsqueda y carrera seleccionada
  const filterMaterias = useCallback(() => {
    let filtered = [...materias];
    
    // Filtrar por carrera si hay una seleccionada
    if (selectedCarreraFilter) {
      filtered = filtered.filter(materia => 
        materia.carrera_id === parseInt(selectedCarreraFilter)
      );
    }
    
    // Filtrar por texto de búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(materia => 
        materia.nombre.toLowerCase().includes(query) || 
        (materia.clave && materia.clave.toString().includes(query))
      );
    }
    
    setFilteredMaterias(filtered);
  }, [materias, selectedCarreraFilter, searchQuery]);
  
  // Actualizar filtros cuando cambian los criterios
  useEffect(() => {
    filterMaterias();
  }, [filterMaterias]);

  // Función para verificar si una materia está seleccionada
  const isMateriaSelected = (materia, selectedMaterias) => {
    return selectedMaterias.some(m => 
      typeof m === 'string' 
        ? m === materia.nombre 
        : m.id === materia.id || m.nombre === materia.nombre
    );
  };
  
  const handleMateriaSelection = (materia) => {
    setFormData((prev) => {
      // Verificar si la materia ya está seleccionada
      const isSelected = isMateriaSelected(materia, prev.materiasInteres);
      
      // Si ya está seleccionada, la quitamos; si no, la agregamos
      let updatedMaterias;
      
      if (isSelected) {
        // Quitar la materia seleccionada
        updatedMaterias = prev.materiasInteres.filter(m => 
          typeof m === 'string' 
            ? m !== materia.nombre 
            : m.id !== materia.id && m.nombre !== materia.nombre
        );
      } else {
        // Agregar la materia completa
        updatedMaterias = [...prev.materiasInteres, {
          id: materia.id,
          nombre: materia.nombre,
          clave: materia.clave,
          carreraNombre: materia.carreraNombre
        }];
      }
      
      console.log("Materias seleccionadas:", updatedMaterias);
      return { ...prev, materiasInteres: updatedMaterias };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "materiasInteres") {
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selected.push(options[i].value);
      }
      console.log("Materias seleccionadas:", selected);
      setFormData((prev) => ({ ...prev, materiasInteres: selected }));
    } else {
      console.log(`Campo ${name} cambiado a: ${value}`);
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      const allowedTypes = [
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          archivo: "Tipo de archivo no válido. Solo se permiten PDF",
        }));
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          archivo: "El archivo es demasiado grande. Máximo 10MB.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        archivo: file,
      }));

      // Limpiar error cuando se selecciona un archivo válido
      if (errors.archivo) {
        setErrors((prev) => ({
          ...prev,
          archivo: "",
        }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({
      ...prev,
      archivo: null,
    }));
  };

  const validateForm = () => {
    const newErrors = { general: "" }; // Inicializa con general vacío

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellidoMaterno.trim()) {
      newErrors.apellidoMaterno = "El apellido materno es requerido";
    }

    if (!formData.apellidoPaterno.trim()) {
      newErrors.apellidoPaterno = "El apellido paterno es requerido";
    }

    if (!formData.clave.trim()) {
      newErrors.clave = "La clave es requerida";
    }

    if (!formData.cicloEscolar.trim()) {
      newErrors.cicloEscolar = "El ciclo escolar es requerido";
    }

    if (!formData.universidad || !formData.universidad.trim()) {
      newErrors.universidad = "La universidad es requerida";
    }

    if (!formData.carrera.trim()) {
      newErrors.carrera = "La carrera es requerida";
    }

    // No requerir materias ya que las materias serán agregadas por el admin
    // El usuario seleccionará materias si están disponibles

    if (!formData.archivo) {
      newErrors.archivo = "Por favor, sube un archivo";
    }

    const hasErrors = Object.keys(newErrors).filter(key => key !== 'general' && newErrors[key]).length > 0;
    
    if (hasErrors) {
      newErrors.general = "Por favor, completa todos los campos requeridos";
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Iniciando envío de formulario");

    // Validar el formulario primero
    if (!validateForm()) {
      console.log("Formulario no válido, se detiene el envío");
      setSubmitStatus("error"); // Actualizar estado para mostrar mensaje de error
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    console.log("Estado de envío actualizado, comenzando preparación de datos");

    try {
      // Verificar si el usuario está autenticado y hay un token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No se encontró token de autenticación");
        setSubmitStatus("error");
        setErrors(prevErrors => ({
          ...prevErrors, 
          general: "No estás autenticado. Por favor, inicia sesión nuevamente."
        }));
        setIsSubmitting(false);
        return;
      }
      console.log("Token de autenticación encontrado:", token.substring(0, 10) + "...");

      const submitData = new FormData();
      submitData.append("nombre", formData.nombre);
      submitData.append("apellidoMaterno", formData.apellidoMaterno);
      submitData.append("apellidoPaterno", formData.apellidoPaterno);
      submitData.append("clave", formData.clave);
      submitData.append("cicloEscolar", formData.cicloEscolar);
      submitData.append("universidad", formData.universidad);
      submitData.append("carrera", formData.carrera);
      
      // Convertir los objetos de materia a un formato adecuado para enviar
      const materiasToSubmit = formData.materiasInteres.map(materia => {
        if (typeof materia === 'string') {
          return { nombre: materia };
        }
        return materia;
      });
      
      console.log("Materias a enviar:", materiasToSubmit);
      submitData.append("materiasInteres", JSON.stringify(materiasToSubmit));
      
      // Verificar que el archivo exista
      if (formData.archivo) {
        console.log("Añadiendo archivo:", formData.archivo.name, "Tamaño:", formData.archivo.size);
        submitData.append("archivo", formData.archivo);
      } else {
        console.error("No se encontró archivo adjunto");
        setSubmitStatus("error");
        setErrors(prevErrors => ({
          ...prevErrors, 
          general: "El archivo es obligatorio. Por favor, adjunta un archivo."
        }));
        setIsSubmitting(false);
        return;
      }

      console.log("FormData preparado, enviando solicitud al servidor...");
      console.log("URL de destino:", api.defaults.baseURL + "/applications/addApplication");
      
      // Agregar logs para ver todas las entradas del FormData
      for (const pair of submitData.entries()) {
        console.log(`FormData contiene: ${pair[0]}: ${pair[1]}`);
      }
      
      const res = await api.post("/applications/addApplication", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Respuesta del servidor:", res.data);
      
      if (res.data && res.data.success) {
        console.log("Solicitud enviada exitosamente");
        setExistingApplication(res.data.data);
        setErrors(prev => ({ ...prev, general: "" })); // Limpiar error general
        setSubmitStatus("success");
        
        // Redirigir después de un tiempo
        setTimeout(() => {
          console.log("Redirigiendo...");
          window.location.href = '/perfil';
        }, 2000);
      } else {
        // Si hay respuesta pero no es exitosa
        console.error("Respuesta del servidor indica error:", res.data);
        setSubmitStatus("error");
        setErrors(prev => ({ 
          ...prev, 
          general: res.data.message || "Error al enviar la solicitud. Por favor, intenta de nuevo." 
        }));
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      
      // Manejo detallado de errores
      let errorMessage = "Error al enviar la solicitud. Intenta de nuevo.";
      
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        console.error("Error de respuesta:", error.response.data);
        console.error("Código de estado:", error.response.status);
        
        if (error.response.status === 401) {
          errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
          // Opcional: Redirigir a la página de login
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 413) {
          errorMessage = "El archivo es demasiado grande. Por favor, sube un archivo más pequeño.";
        } else if (error.response.status >= 500) {
          errorMessage = "Error en el servidor. Por favor, inténtalo más tarde o contacta al administrador.";
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("Error de solicitud (sin respuesta):", error.request);
        errorMessage = "No se recibió respuesta del servidor. Verifica tu conexión a internet.";
      } else {
        // Algo sucedió al configurar la solicitud que desencadenó un error
        console.error("Error de configuración:", error.message);
        if (error.message.includes('Network Error')) {
          errorMessage = "Error de red. Comprueba tu conexión a internet.";
        } else {
          errorMessage = `Error al enviar el formulario: ${error.message}`;
        }
      }
      
      setErrors(prevErrors => ({ ...prevErrors, general: errorMessage }));
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Mostrar cargador mientras se verifica si el usuario tiene una solicitud
  if (loading) {
    return (
      <div className="form-container">
        <header className="form-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Cargando...</h1>
            </div>
          </div>
        </header>
        <div className="form-layout">
          <main className="form-main">
            <div className="form-card">
              <div className="loading-spinner-container" style={{display: 'flex', justifyContent: 'center', padding: '2rem'}}>
                <div className="loading-spinner" style={{width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
              </div>
              <p style={{textAlign: 'center'}}>Cargando información de solicitud...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Si ya existe una solicitud, mostrar información
  if (existingApplication) {
    return (
      <div className="form-container">
        <header className="form-header">
          <div className="header-content">
            <div className="header-text">
              <h1>Solicitud de Registro</h1>
            </div>
          </div>
        </header>

        <div className="form-layout">
          <main className="form-main">
            <div className="form-card">
              <div className="form-card-header">
                <h2>Solicitud ya enviada</h2>
                <p>Ya has enviado una solicitud de registro. Puedes ver su estado en tu perfil.</p>
              </div>
              <div className="application-status-info">
                <p>Estado: <strong>{existingApplication.estado || "Pendiente"}</strong></p>
                <p>Enviada el: <strong>{new Date(existingApplication.created_at).toLocaleDateString()}</strong></p>
                <div className="form-actions" style={{marginTop: '20px'}}>
                  <a href="/perfil" className="submit-btn">
                    Ver detalles en mi perfil
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <header className="form-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Solicitud de Registro</h1>
          </div>
        </div>
      </header>

      <div className="form-layout">
        <main className="form-main">
          <div className="form-card">
            <div className="form-card-header">
              <h2>Información del Estudiante</h2>
              <p>Complete todos los campos para enviar su solicitud</p>
            </div>

            {submitStatus === "success" && (
              <div className="status-message success">
                <CheckCircle className="status-icon" />
                <div>
                  <h4>¡Solicitud enviada exitosamente!</h4>
                  <p>
                    Recibirás una confirmación por correo electrónico pronto.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="status-message error">
                <AlertCircle className="status-icon" />
                <div>
                  <h4>Error al enviar la solicitud</h4>
                  <p>
                    {errors.general || "Por favor, inténtalo de nuevo o contacta al administrador."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Mostrar errores de validación generales incluso sin submitStatus */}
            {errors.general && submitStatus !== "error" && submitStatus !== "success" && (
              <div className="validation-error-message">
                <p>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mobility-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    <User className="label-icon" />
                    Nombre(s)
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={user?.nombres}
                    onChange={handleInputChange}
                    className={`form-input ${errors.nombre ? "error" : ""}`}
                    placeholder="Ingresa tu(s) nombre(s)"
                  />
                  {errors.nombre && (
                    <span className="error-message">{errors.nombre}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidoPaterno" className="form-label">
                    <User className="label-icon" />
                    Apellido Paterno
                  </label>
                  <input
                    type="text"
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleInputChange}
                    className={`form-input ${errors.apellidoPaterno ? "error" : ""}`}
                    placeholder="Ingresa tu apellido paterno"
                  />
                  {errors.apellidoPaterno && (
                    <span className="error-message">{errors.apellidoPaterno}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="apellidoMaterno" className="form-label">
                    <User className="label-icon" />
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    value={formData.apellidoMaterno}
                    onChange={handleInputChange}
                    className={`form-input ${errors.apellidoMaterno ? "error" : ""}`}
                    placeholder="Ingresa tu apellido materno"
                  />
                  {errors.apellidoMaterno && (
                    <span className="error-message">{errors.apellidoMaterno}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="clave" className="form-label">
                    <Hash className="label-icon" />
                    Clave
                  </label>
                  <input
                    type="text"
                    id="clave"
                    name="clave"
                    value={formData.clave}
                    onChange={handleInputChange}
                    className={`form-input ${errors.clave ? "error" : ""}`}
                    placeholder="Ingresa tu clave"
                  />
                  {errors.clave && (
                    <span className="error-message">{errors.clave}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cicloEscolar" className="form-label">
                    <Calendar className="label-icon" />
                    Ciclo Escolar
                  </label>
                  <select
                    id="cicloEscolar"
                    name="cicloEscolar"
                    value={formData.cicloEscolar}
                    onChange={handleInputChange}
                    className={`form-input ${errors.cicloEscolar ? "error" : ""}`}
                    onClick={() => console.log("Ciclo escolar dropdown clicked")}
                  >
                    <option value="">Selecciona ciclo escolar</option>
                    {generateCiclosEscolares().map(ciclo => {
                      console.log("Opción de ciclo:", ciclo);
                      return (
                        <option key={ciclo.value} value={ciclo.value}>
                          {ciclo.label}
                        </option>
                      );
                    })}
                  </select>
                  {errors.cicloEscolar && (
                    <span className="error-message">{errors.cicloEscolar}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="universidad" className="form-label">
                    <Building2 className="label-icon" />
                    Universidad de Destino
                  </label>
                  <input
                    type="text"
                    id="universidad"
                    name="universidad"
                    value={formData.universidad}
                    onChange={handleInputChange}
                    className={`form-input ${errors.universidad ? "error" : ""}`}
                    placeholder="Nombre de la universidad"
                  />
                  {errors.universidad && (
                    <span className="error-message">{errors.universidad}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="carrera" className="form-label">
                    <GraduationCap className="label-icon" />
                    Carrera
                  </label>
                  {user && user.carrera_id ? (
                    <input
                      type="text"
                      id="carrera"
                      name="carrera"
                      value={formData.carrera}
                      disabled={true}
                      className={`form-input ${errors.carrera ? "error" : ""}`}
                      placeholder="Tu carrera actual"
                    />
                  ) : (
                    <select
                      id="carrera"
                      name="carrera"
                      value={formData.carrera}
                      onChange={handleInputChange}
                      className={`form-input ${errors.carrera ? "error" : ""}`}
                    >
                      <option value="">Selecciona tu carrera</option>
                      {carreras.map(carrera => (
                        <option key={carrera.id} value={carrera.nombre}>
                          {carrera.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.carrera && (
                    <span className="error-message">{errors.carrera}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <BookOpen className="label-icon" />
                    Materias de Interés
                  </label>
                  
                  <div className="materias-selection">
                    <button 
                      type="button" 
                      className="select-materias-btn"
                      onClick={() => setShowMateriasModal(true)}
                    >
                      <BookOpen className="btn-icon" />
                      Seleccionar Materias ({formData.materiasInteres.length})
                    </button>
                    
                    <MateriasSlider 
                      materias={formData.materiasInteres}
                      onRemove={handleMateriaSelection}
                      readOnly={false}
                    />
                  </div>
                  
                  {errors.materiasInteres && (
                    <span className="error-message">{errors.materiasInteres}</span>
                  )}
                </div>

                <div className="form-group full-width upload-container">
                  <label className="form-label">
                    <Upload className="label-icon" />
                    Subir Archivo (PDF)
                  </label>
                  <div
                    className={`file-upload-area expanded ${dragActive ? "drag-active" : ""} ${
                      errors.archivo ? "error" : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                      className="file-input"
                      id="archivo"
                    />
                    
                    {formData.archivo ? (
                      <div className="file-preview expanded-preview">
                        <div className="file-info">
                          <FileText className="file-icon" size={36} />
                          <div className="file-details">
                            <span className="file-name">{formData.archivo.name}</span>
                            <span className="file-size">
                              {formatFileSize(formData.archivo.size)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="remove-file-btn"
                          aria-label="Remover archivo"
                        >
                          <X className="remove-icon" />
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder expanded-placeholder">
                        <Upload className="upload-icon" size={48} />
                        <h3 className="upload-title">
                          Haz clic para subir o arrastra y suelta
                        </h3>
                        <p className="upload-hint">PDF (máx. 10MB)</p>
                      </div>
                    )}
                  </div>
                  {errors.archivo && (
                    <span className="error-message">{errors.archivo}</span>
                  )}
                </div>

                {errors.archivo && (
                  <span className="error-message">{errors.archivo}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="loading-spinner"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="btn-icon" />
                      Enviar Solicitud
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      
      {/* Modal para selección de materias */}
      {showMateriasModal && (
        <div className="modal-overlay">
          <div className="materias-modal">
            <div className="modal-header">
              <h3>Selección de Materias</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowMateriasModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-filters">
              <div className="search-input-container">
                <input 
                  type="text"
                  placeholder="Buscar por nombre o clave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="filter-select-container">
                <select
                  value={selectedCarreraFilter}
                  onChange={(e) => setSelectedCarreraFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todas las carreras</option>
                  {carreras.map(carrera => (
                    <option key={carrera.id} value={carrera.id}>
                      {carrera.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="modal-body">
              <div className="materias-modal-grid">
                {filteredMaterias.length > 0 ? (
                  filteredMaterias.map(materia => (
                    <div 
                      key={materia.id} 
                      className={`materia-card ${isMateriaSelected(materia, formData.materiasInteres) ? 'selected' : ''}`}
                      onClick={() => handleMateriaSelection(materia)}
                    >
                      <div className="materia-content">
                        <BookOpen className="materia-icon" />
                        <div>
                          <h3 className="materia-nombre">{materia.nombre}</h3>
                          <div className="materia-details">
                            {materia.clave && (
                              <p className="materia-clave">Clave: {materia.clave}</p>
                            )}
                            <p className="materia-carrera">{materia.carreraNombre}</p>
                          </div>
                        </div>
                      </div>
                      <div className="materia-check">
                        {isMateriaSelected(materia, formData.materiasInteres) && (
                          <CheckCircle className="check-icon" />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results-message">
                    <BookOpen size={48} />
                    <p>No se encontraron materias con los filtros seleccionados</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowMateriasModal(false)}
              >
                Cerrar
              </button>
              <button 
                type="button" 
                className="apply-btn"
                onClick={() => setShowMateriasModal(false)}
              >
                Confirmar Selección ({formData.materiasInteres.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistroMateria;