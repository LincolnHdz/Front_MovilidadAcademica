import React from "react";
import { Calendar } from "lucide-react";
import "./CicloEscolarSelector.css";

const CicloEscolarSelector = ({ 
  valueInicio, 
  valueFinal,
  onChangeInicio,
  onChangeFinal,
  className = "", 
  disabled = false, 
  showLabel = true 
}) => {
  // Generar opciones de ciclos escolares dinámicamente
  const generateCiclosEscolares = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() devuelve 0-11
    
    const ciclos = [];
    
    // Determinar el año base del ciclo actual
    // Si estamos en enero-julio, el ciclo actual comenzó el año anterior
    // Si estamos en agosto-diciembre, el ciclo actual comenzó este año
    let currentCycleStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
    // Generar ciclos desde 1 año atrás hasta 3 años adelante
    for (let yearOffset = -1; yearOffset <= 3; yearOffset++) {
      const startYear = currentCycleStartYear + yearOffset;
      
      // Agregar ambos semestres para cada año
      ciclos.push({
        value: `${startYear}/I`,
        label: `${startYear}/I`,
        year: startYear,
        semester: 'I'
      });
      ciclos.push({
        value: `${startYear}/II`,
        label: `${startYear}/II`,
        year: startYear,
        semester: 'II'
      });
    }
    
    // Ordenar por año y luego por semestre (más reciente primero)
    return ciclos.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year; // Más reciente primero
      }
      return a.semester === 'I' ? 1 : -1; // Semestre II antes que I en el mismo año
    });
  };

  const ciclosEscolares = generateCiclosEscolares();

  return (
    <div className={`ciclo-escolar-selector ${className}`}>
      {showLabel && (
        <label className="ciclo-label">
          <Calendar className="label-icon" />
          Ciclo Escolar
        </label>
      )}
      
      <div className="ciclo-inputs-container">
        <div className="ciclo-input-group">
          <select
            id="cicloInicio"
            name="cicloInicio"
            value={valueInicio || ''}
            onChange={(e) => onChangeInicio(e.target.value)}
            className="ciclo-select"
            disabled={disabled}
          >
            <option value="">Inicio</option>
            {ciclosEscolares.map(ciclo => (
              <option key={`inicio-${ciclo.value}`} value={ciclo.value}>
                {ciclo.label}
              </option>
            ))}
          </select>
        </div>

        <div className="ciclo-separator">-</div>

        <div className="ciclo-input-group">
          <select
            id="cicloFinal"
            name="cicloFinal"
            value={valueFinal || ''}
            onChange={(e) => onChangeFinal(e.target.value)}
            className="ciclo-select"
            disabled={disabled}
          >
            <option value="">Final</option>
            {ciclosEscolares.map(ciclo => (
              <option key={`final-${ciclo.value}`} value={ciclo.value}>
                {ciclo.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CicloEscolarSelector;