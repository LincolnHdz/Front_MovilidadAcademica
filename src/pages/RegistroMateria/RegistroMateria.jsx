import React, { useState } from "react";
import {
  Upload,
  Send,
  User,
  GraduationCap,
  BookOpen,
  Building2,
  X,
  FileText,
  CheckCircle,
  AlertCircle,
  Hash,
  Calendar
} from "lucide-react";
import "./RegistroMateria.css";

const RegistroMateria = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoMaterno: "",
    apellidoPaterno: "",
    clave: "",
    claveMateria: "",
    cicloEscolar: "",
    universidad: "",
    carrera: "",
    materia: "",
    archivo: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

   
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
          archivo:
            "Tipo de archivo no válido. Solo se permiten PDF",
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
    const newErrors = {};

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

    if (!formData.claveMateria.trim()) {
      newErrors.claveMateria = "La clave materia es requerida";
    }

    if (!formData.cicloEscolar.trim()) {
      newErrors.cicloEscolar = "El ciclo escolar es requerido";
    }

    if (!formData.universidad.trim()) {
      newErrors.universidad = "La universidad es requerida";
    }

    if (!formData.carrera.trim()) {
      newErrors.carrera = "La carrera es requerida";
    }

    if (!formData.materia.trim()) {
      newErrors.materia = "La materia es requerida";
    }

    if (!formData.archivo) {
      newErrors.archivo = "Por favor, sube un archivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the data to your backend
      const submitData = new FormData();
      submitData.append("nombre", formData.nombre);
      submitData.append("apellidoMaterno", formData.apellidoMaterno);
      submitData.append("apellidoPaterno", formData.apellidoPaterno);
      submitData.append("clave", formData.clave);
      submitData.append("claveMateria", formData.claveMateria);
      submitData.append("cicloEscolar", formData.cicloEscolar);
      submitData.append("universidad", formData.universidad);
      submitData.append("carrera", formData.carrera);
      submitData.append("materia", formData.materia);
      submitData.append("archivo", formData.archivo);

      console.log("Form data to submit:", formData);

      setSubmitStatus("success");

      //Borrar el formulario
      setFormData({
        nombre: "",
        apellidoMaterno: "",
        apellidoPaterno: "",
        clave: "",
        claveMateria: "",
        cicloEscolar: "",
        universidad: "",
        carrera: "",
        materia: "",
        archivo: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
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

  return (
    <div className="form-container">
      <header className="form-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Solicitud de Registro de Materia</h1>
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
                    Por favor, inténtalo de nuevo o contacta al administrador.
                  </p>
                </div>
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
                    value={formData.nombre}
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
                    className={`form-input ${
                      errors.apellidoPaterno ? "error" : ""
                    }`}
                    placeholder="Ingresa tu apellido paterno"
                  />
                  {errors.apellidoPaterno && (
                    <span className="error-message">
                      {errors.apellidoPaterno}
                    </span>
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
                    className={`form-input ${
                      errors.apellidoMaterno ? "error" : ""
                    }`}
                    placeholder="Ingresa tu apellido materno"
                  />
                  {errors.apellidoMaterno && (
                    <span className="error-message">
                      {errors.apellidoMaterno}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="clave" className="form-label">
                    <Building2 className="label-icon" />
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
                  <label htmlFor="claveMateria" className="form-label">
                    <Hash className="label-icon" />
                    Clave Materia
                  </label>
                  <input
                    type="text"
                    id="claveMateria"
                    name="claveMateria"
                    value={formData.claveMateria}
                    onChange={handleInputChange}
                    className={`form-input ${errors.claveMateria ? "error" : ""}`}
                    placeholder="Ingresa la clave de la materia"
                  />
                  {errors.claveMateria && (
                    <span className="error-message">{errors.claveMateria}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="cicloEscolar" className="form-label">
                    <Calendar className="label-icon" />
                    Ciclo Escolar
                  </label>
                  <input
                    type="text"
                    id="cicloEscolar"
                    name="cicloEscolar"
                    value={formData.cicloEscolar}
                    onChange={handleInputChange}
                    className={`form-input ${errors.cicloEscolar ? "error" : ""}`}
                    placeholder="Ingresa el ciclo escolar"
                  />
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
                    className={`form-input ${
                      errors.universidad ? "error" : ""
                    }`}
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
                  <input
                    type="text"
                    id="carrera"
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className={`form-input ${errors.carrera ? "error" : ""}`}
                    placeholder="Tu carrera actual"
                  />
                  {errors.carrera && (
                    <span className="error-message">{errors.carrera}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="materia" className="form-label">
                    <BookOpen className="label-icon" />
                    Materia
                  </label>
                  <input
                    type="text"
                    id="materia"
                    name="materia"
                    value={formData.materia}
                    onChange={handleInputChange}
                    className={`form-input ${errors.materia ? "error" : ""}`}
                    placeholder="Materia de interés"
                  />
                  {errors.materia && (
                    <span className="error-message">{errors.materia}</span>
                  )}
                </div>
              </div>

              <div className="form-group file-group">
                <label className="form-label">
                  <Upload className="label-icon" />
                  Archivo de Solicitud
                </label>

                <div
                  className={`file-upload-area ${
                    dragActive ? "drag-active" : ""
                  } ${errors.archivo ? "error" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {!formData.archivo ? (
                    <>
                      <Upload className="upload-icon" />
                      <div className="upload-text">
                        <p>
                          <strong>Arrastra tu archivo aquí</strong> o haz clic
                          para seleccionar
                        </p>
                        <p className="upload-subtitle">
                          PDF(máx. 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e.target.files[0])}
                        className="file-input"
                        accept=".pdf"
                      />
                    </>
                  ) : (
                    <div className="file-preview">
                      <FileText className="file-icon" />
                      <div className="file-info">
                        <p className="file-name">{formData.archivo.name}</p>
                        <p className="file-size">
                          {formatFileSize(formData.archivo.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="remove-file-btn"
                        aria-label="Remover archivo"
                      >
                        <X size={20} />
                      </button>
                    </div>
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
    </div>
  );
};

export default RegistroMateria;
