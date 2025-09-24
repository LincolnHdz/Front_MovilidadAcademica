import React, { useState, useEffect } from "react";
import "./ConvocatoriasList.css";
import ConvocatoriaForm from "./ConvocatoriaForm";
import { useAuth } from "../context/useAuth";
import api from "../api/axiosConfig"; 

const ConvocatoriasList = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConvocatoria, setEditingConvocatoria] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      setLoading(true);
      const res = await api.get("/convocatorias");

      if (res.data.success) {
        setConvocatorias(res.data.data);
      } else {
        throw new Error(res.data.message || "Error al obtener convocatorias");
      }
    } catch (err) {
      console.error("Error fetching convocatorias:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConvocatoriaCreated = (newConvocatoria) => {
    if (editingConvocatoria) {
      setConvocatorias((prev) =>
        prev.map((conv) =>
          conv.id === editingConvocatoria.id ? newConvocatoria : conv
        )
      );
      setEditingConvocatoria(null);
    } else {
      setConvocatorias((prev) => [newConvocatoria, ...prev]);
    }
    setShowForm(false);
  };

  const handleEdit = (convocatoria) => {
    setEditingConvocatoria(convocatoria);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta convocatoria?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/convocatorias/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data.success) {
        setConvocatorias((prev) => prev.filter((conv) => conv.id !== id));
      } else {
        throw new Error(res.data.message || "Error al eliminar la convocatoria");
      }
    } catch (err) {
      console.error("Error deleting convocatoria:", err);
      alert("Error al eliminar la convocatoria: " + err.message);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingConvocatoria(null);
  };

  if (loading) {
    return (
      <div className="convocatorias-container">
        <h3>Convocatorias Vigentes</h3>
        <div className="loading">
          <p>Cargando convocatorias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="convocatorias-container">
        <h3>Convocatorias Vigentes</h3>
        <div className="error">
          <p>Error al cargar las convocatorias: {error}</p>
          <button onClick={fetchConvocatorias} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="convocatorias-container">
      <div className="convocatorias-header">
        <h3>Convocatorias Vigentes</h3>
        {user && (user.rol === "becarios" || user.rol === "administrador") && (
          <button
            onClick={() => setShowForm(true)}
            className="add-convocatoria-btn"
          >
            + Nueva Convocatoria
          </button>
        )}
      </div>

      {showForm && (
        <ConvocatoriaForm
          onConvocatoriaCreated={handleConvocatoriaCreated}
          onCancel={handleCancelForm}
          convocatoriaToEdit={editingConvocatoria}
        />
      )}

      {convocatorias.length === 0 ? (
        <div className="no-convocatorias">
          <p>No hay convocatorias disponibles en este momento.</p>
          <p>¡Crea la primera convocatoria usando el botón de arriba!</p>
        </div>
      ) : (
        <div className="convocatorias-grid">
          {convocatorias.map((convocatoria) => (
            <div key={convocatoria.id} className="convocatoria-card">
              <div className="convocatoria-header">
                <h4>{convocatoria.titulo}</h4>
                <span className="convocatoria-fecha">
                  {formatDate(convocatoria.fecha)}
                </span>
              </div>
              <div className="convocatoria-content">
                <p>{convocatoria.descripcion}</p>
              </div>
              <div className="convocatoria-footer">
                <div className="convocatoria-actions">
                  <button
                    onClick={() => handleEdit(convocatoria)}
                    className="edit-btn"
                    title="Editar convocatoria"
                  >
                    {/* SVG de edición corregido */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(convocatoria.id)}
                    className="delete-btn"
                    title="Eliminar convocatoria"
                  >
                    {/* SVG de eliminación corregido */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
                <span className="convocatoria-id">ID: {convocatoria.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasList;
