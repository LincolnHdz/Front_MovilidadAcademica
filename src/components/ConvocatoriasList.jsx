import React, { useState, useEffect } from "react";
import "./ConvocatoriasList.css";
import ConvocatoriaForm from "./ConvocatoriaForm";

const ConvocatoriasList = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingConvocatoria, setEditingConvocatoria] = useState(null);


  const API_URL = "http://localhost:3000/api/convocatorias";

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setConvocatorias(data.data);
      } else {
        throw new Error(data.message || "Error al obtener convocatorias");
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
    if (
      !window.confirm(
        "¿Estás seguro de que quieres eliminar esta convocatoria?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setConvocatorias((prev) => prev.filter((conv) => conv.id !== id));
      } else {
        throw new Error(data.message || "Error al eliminar la convocatoria");
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
        <button
          onClick={() => setShowForm(true)}
          className="add-convocatoria-btn"
        >
          + Nueva Convocatoria
        </button>
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
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(convocatoria.id)}
                    className="delete-btn"
                    title="Eliminar convocatoria"
                  >
                    🗑️
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
