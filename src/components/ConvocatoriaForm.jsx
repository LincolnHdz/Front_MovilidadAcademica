import React, { useState } from "react";
import "./ConvocatoriaForm.css";
import api from "../api/axiosConfig";

const ConvocatoriaForm = ({
  onConvocatoriaCreated,
  onCancel,
  convocatoriaToEdit = null,
}) => {
  const [formData, setFormData] = useState({
    titulo: convocatoriaToEdit?.titulo || "",
    descripcion: convocatoriaToEdit?.descripcion || "",
    fecha: convocatoriaToEdit?.fecha || "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const API_URL = "http://localhost:3000/api/convocatorias";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };
  
  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = convocatoriaToEdit
        ? `/convocatorias/${convocatoriaToEdit.id}`
        : "/convocatorias";

      const method = convocatoriaToEdit ? "put" : "post";
      const token = localStorage.getItem("token");

      // Prepare form data for image upload
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("fecha", formData.fecha);
      if (image) {
        formDataToSend.append("imagen", image);
      }

      const res = await api({
        method,
        url,
        data: formDataToSend,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        onConvocatoriaCreated(res.data.data);
        setFormData({ titulo: "", descripcion: "", fecha: "" });
        setImage(null);
      } else {
        throw new Error(res.data.message || "Error al procesar la convocatoria");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="convocatoria-form-container">
      <div className="form-header">
        <h3>
          {convocatoriaToEdit ? "Editar Convocatoria" : "Nueva Convocatoria"}
        </h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-btn">
            X
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="convocatoria-form">
        <div className="form-group">
          <label htmlFor="titulo">
            <span>Título</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            onFocus={() => handleFocus('titulo')}
            onBlur={handleBlur}
            required
            placeholder="Ej: Convocatoria Erasmus+ 2025"
            className={`form-input ${focusedField === 'titulo' ? 'input-focused' : ''}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            <span>Descripción</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            onFocus={() => handleFocus('descripcion')}
            onBlur={handleBlur}
            required
            rows="5"
            placeholder="Describe los detalles de la convocatoria, requisitos, beneficios, etc."
            className={`form-textarea ${focusedField === 'descripcion' ? 'input-focused' : ''}`}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">
            <span>Fecha Límite</span>
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            onFocus={() => handleFocus('fecha')}
            onBlur={handleBlur}
            required
            className={`form-input ${focusedField === 'fecha' ? 'input-focused' : ''}`}
          />
          <small className="form-hint">Selecciona la fecha límite para postularse</small>
        </div>

        <div className="form-group">
          <label htmlFor="imagen">
            <span>Imagen (opcional)</span>
          </label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {image && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={URL.createObjectURL(image)} alt="Previsualización" style={{ maxWidth: '180px', maxHeight: '120px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <>
                <span className="spinner"></span>
                <span>Guardando...</span>
              </>
            ) : convocatoriaToEdit ? (
              'Actualizar Convocatoria'
            ) : (
              'Crear Convocatoria'
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-form-btn"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ConvocatoriaForm;
