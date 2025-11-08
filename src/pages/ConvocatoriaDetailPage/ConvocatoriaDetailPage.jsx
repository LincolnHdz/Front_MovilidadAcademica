import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./ConvocatoriaDetailPage.css";

const ConvocatoriaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [convocatoria, setConvocatoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConvocatoria();
  }, [id]);

  const fetchConvocatoria = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/convocatorias/${id}`);

      if (res.data.success) {
        setConvocatoria(res.data.data);
      } else {
        throw new Error(res.data.message || "Error al obtener la convocatoria");
      }
    } catch (err) {
      console.error("Error fetching convocatoria:", err);
      setError(
        err.response?.data?.message || "Error al cargar la convocatoria"
      );
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

  const handleBack = () => {
    navigate("/convocatorias-lista");
  };

  if (loading) {
    return (
      <div className="convocatoria-detail-page">
        <div className="convocatoria-detail-container">
          <div className="loading">
            <p>Cargando convocatoria...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="convocatoria-detail-page">
        <div className="convocatoria-detail-container">
          <div className="error">
            <p>Error al cargar la convocatoria: {error}</p>
            <button onClick={handleBack} className="back-btn">
              Volver a convocatorias
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!convocatoria) {
    return (
      <div className="convocatoria-detail-page">
        <div className="convocatoria-detail-container">
          <div className="error">
            <p>Convocatoria no encontrada</p>
            <button onClick={handleBack} className="back-btn">
              Volver a convocatorias
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="convocatoria-detail-page">
      <div className="convocatoria-detail-container">
        <button onClick={handleBack} className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver a convocatorias
        </button>

        <div className="convocatoria-detail-card">
          {convocatoria.imagen && (
            <div className="convocatoria-detail-image-container">
              <img
                src={`http://localhost:3000${convocatoria.imagen}`}
                alt={convocatoria.titulo}
                className="convocatoria-detail-image"
              />
            </div>
          )}

          <div className="convocatoria-detail-header">
            <h1>{convocatoria.titulo}</h1>
            <span className="convocatoria-detail-fecha">
              {formatDate(convocatoria.fecha)}
            </span>
          </div>

          <div className="convocatoria-detail-content">
            <div className="convocatoria-detail-description">
              <h2>Descripción</h2>
              <p>{convocatoria.descripcion}</p>
            </div>
          </div>

          <div className="convocatoria-detail-footer">
            <div className="convocatoria-detail-meta">
              <span className="convocatoria-id">ID: {convocatoria.id}</span>
              {convocatoria.created_at && (
                <span className="convocatoria-created">
                  Creada: {formatDate(convocatoria.created_at)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConvocatoriaDetailPage;
