import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ConvocatoriasSlider.css";
import api from "../api/axiosConfig";

const ConvocatoriasSlider = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConvocatorias();
  }, []);

  const fetchConvocatorias = async () => {
    try {
      setLoading(true);
      const res = await api.get("/convocatorias");

      if (res.data.success) {
        // 👇 Solo traemos las primeras 5
        setConvocatorias(res.data.data.slice(0, 5));
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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === convocatorias.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? convocatorias.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleVerTodas = () => {
    navigate("/convocatorias-lista");
  };

  const handleCardClick = (convocatoriaId) => {
    navigate(`/convocatoria/${convocatoriaId}`);
  };

  if (loading) {
    return (
      <div className="convocatorias-slider-container">
        <h3>Convocatorias Vigentes</h3>
        <div className="loading">
          <p>Cargando convocatorias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="convocatorias-slider-container">
        <h3>Convocatorias Vigentes</h3>
        <div className="error">
          <p>Error al cargar las convocatorias: {error}</p>
        </div>
      </div>
    );
  }

  if (convocatorias.length === 0) {
    return (
      <div className="convocatorias-slider-container">
        <h3>Convocatorias Vigentes</h3>
        <div className="no-convocatorias">
          <p>No hay convocatorias disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="convocatorias-slider-container">
      <div className="slider-header">
        <h3>Convocatorias Vigentes</h3>
        <button onClick={handleVerTodas} className="ver-todas-btn">
          Ver todas las convocatorias
        </button>
      </div>

      <div className="slider-wrapper">
        <div className="slider-container">
          <div
            className="slider-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {convocatorias.map((convocatoria) => (
              <div key={convocatoria.id} className="slider-slide">
                <div
                  className="convocatoria-card clickable-card"
                  onClick={() => handleCardClick(convocatoria.id)}
                >
                  <div className="convocatoria-header">
                    <h4>{convocatoria.titulo}</h4>
                    <span className="convocatoria-fecha">
                      {formatDate(convocatoria.fecha)}
                    </span>
                  </div>
                  <div className="convocatoria-content">
                    <p>{convocatoria.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {convocatorias.length > 1 && (
          <>
            <button className="slider-btn prev-btn" onClick={prevSlide}>
              ‹
            </button>
            <button className="slider-btn next-btn" onClick={nextSlide}>
              ›
            </button>
          </>
        )}
      </div>

      {convocatorias.length > 1 && (
        <div className="slider-dots">
          {convocatorias.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvocatoriasSlider;
