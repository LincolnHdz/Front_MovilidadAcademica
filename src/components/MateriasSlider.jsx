import React, { useRef } from 'react';
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';
import './MateriasSlider.css';

const MateriasSlider = ({ materias, onRemove, readOnly = false, compactMode = false }) => {
  const sliderRef = useRef(null);
  
  // Convertir a array si es un string JSON
  const parseMaterias = () => {
    if (!materias) return [];
    
    // Si ya es un array
    if (Array.isArray(materias)) return materias;
    
    // Si es un string JSON
    if (typeof materias === 'string') {
      try {
        return JSON.parse(materias);
      } catch (error) {
        console.error('Error parsing materias:', error);
        return [];
      }
    }
    
    return [];
  };
  
  const parsedMaterias = parseMaterias();
  // En modo compacto siempre usamos slider horizontal
  const showSlider = compactMode || parsedMaterias.length > 3;
  
  if (parsedMaterias.length === 0) {
    return (
      <div className="no-materias-message">
        <p>No hay materias seleccionadas.</p>
      </div>
    );
  }
  
  return (
    <div className={`materias-slider-container ${compactMode ? 'compact-mode' : ''}`}>
      <div 
        className={`${showSlider ? "materias-slider" : "materias-grid"} ${compactMode ? 'compact-slider' : ''}`}
        ref={showSlider ? sliderRef : null}
      >
        {parsedMaterias.map((materia, index) => (
          <div 
            key={typeof materia === 'object' && materia.id ? materia.id : index} 
            className={`materia-item ${showSlider ? "slider-item" : ""} ${compactMode ? 'compact-item' : ''}`}
          >
            <BookOpen className="materia-icon" />
            <div className="materia-info">
              <p className="materia-name">
                {typeof materia === 'string' 
                  ? materia 
                  : materia.nombre || 'Materia sin nombre'}
              </p>
              {materia.clave && (
                <p className="materia-code">Clave: {materia.clave}</p>
              )}
            </div>
            {!readOnly && onRemove && (
              <button 
                type="button"
                className="remove-materia-btn"
                onClick={() => onRemove(materia)}
                title="Quitar materia"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MateriasSlider;