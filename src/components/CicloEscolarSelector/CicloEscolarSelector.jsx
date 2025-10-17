import React from "react";
import { Calendar } from "lucide-react";
import "./CicloEscolarSelector.css";

const CicloEscolarSelector = ({ 
  value, 
  onChange, 
  className = "", 
  disabled = false, 
  showLabel = true, 
  placeholder = "Selecciona ciclo escolar" 
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
      } else {
        // Para otros ciclos, mostrar ambos semestres
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
    
    // Ordenar por año y semestre
    return ciclos.sort((a, b) => {
      const [yearA, semA] = a.value.split('/');
      const [yearB, semB] = b.value.split('/');
      const [startYearA] = yearA.split('-').map(Number);
      const [startYearB] = yearB.split('-').map(Number);
      
      if (startYearA !== startYearB) {
        return startYearB - startYearA; // Más reciente primero
      }
      return semB.localeCompare(semA); // II antes que I para el mismo año
    });
  };

  const handleChange = (e) => {
    const selectedValue = e.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const ciclosOptions = generateCiclosEscolares();

  return (
    <div className={`ciclo-escolar-selector ${className}`}>
      {showLabel && (
        <label htmlFor="cicloEscolar" className="ciclo-label">
          <Calendar className="label-icon" />
          Ciclo Escolar
        </label>
      )}
      <select
        id="cicloEscolar"
        name="cicloEscolar"
        value={value || ""}
        onChange={handleChange}
        className="ciclo-select"
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {ciclosOptions.map(ciclo => (
          <option key={ciclo.value} value={ciclo.value}>
            {ciclo.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CicloEscolarSelector;