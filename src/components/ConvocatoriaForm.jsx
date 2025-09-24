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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3000/api/convocatorias";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      const res = await api({
        method,
        url,
        data: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.success) {
        onConvocatoriaCreated(res.data.data);
        setFormData({ titulo: "", descripcion: "", fecha: "" });
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
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="convocatoria-form">
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            placeholder="Ej: Convocatoria Erasmus+ 2025"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Describe los detalles de la convocatoria, requisitos, beneficios, etc."
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha">Fecha Límite *</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading
              ? "Guardando..."
              : convocatoriaToEdit
              ? "Actualizar"
              : "Crear"}
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
