import React, { useMemo } from "react";
import "./Filter.css";

// Componente reutilizable para un select de filtro
const FilterSelect = ({ label, value, onChange, options = [], emptyLabel = "Todos" }) => (
  <div className="filter-group">
    <label>{label}:</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="filter-select">
      <option value="">{emptyLabel}</option>
      {Array.isArray(options) && options.map((opt) => (
        <option key={opt.key || opt.id || opt} value={opt.value || opt.id || opt}>
          {opt.label || opt.nombre || opt}
        </option>
      ))}
    </select>
  </div>
);

// Componente principal de filtros para estadísticas
const StatsFilters = ({ filters, onFilterChange, filterOptions = {} }) => {
  // Filtrar carreras por facultad seleccionada
  const filteredCarreras = useMemo(() => {
    const carreras = filterOptions.carreras || [];
    if (!filters.facultad_id) return carreras;
    return carreras.filter(
      (carrera) => String(carrera.facultad_id) === String(filters.facultad_id)
    );
  }, [filterOptions.carreras, filters.facultad_id]);

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    
    // Limpiar carrera si cambia facultad
    if (key === 'facultad_id') {
      newFilters.carrera_id = '';
    }
    
    onFilterChange(newFilters);
  };

  return (
    <div className="filters-grid">
      <FilterSelect
        label="Universidad"
        value={filters.universidad_id}
        onChange={(val) => handleChange('universidad_id', val)}
        options={filterOptions.universidades}
        emptyLabel="Todas"
      />

      <FilterSelect
        label="Facultad"
        value={filters.facultad_id}
        onChange={(val) => handleChange('facultad_id', val)}
        options={filterOptions.facultades}
        emptyLabel="Todas"
      />

      <FilterSelect
        label="Carrera"
        value={filters.carrera_id}
        onChange={(val) => handleChange('carrera_id', val)}
        options={filteredCarreras}
        emptyLabel="Todas"
      />

      <FilterSelect
        label="Beca"
        value={filters.beca_id}
        onChange={(val) => handleChange('beca_id', val)}
        options={filterOptions.becas}
        emptyLabel="Todas"
      />

      <FilterSelect
        label="Tipo de Movilidad"
        value={filters.tipo_movilidad}
        onChange={(val) => handleChange('tipo_movilidad', val)}
        options={filterOptions.tiposMovilidad}
        emptyLabel="Todos"
      />

      <FilterSelect
        label="Ciclo Escolar Inicio"
        value={filters.ciclo_escolar_inicio}
        onChange={(val) => handleChange('ciclo_escolar_inicio', val)}
        options={filterOptions.ciclosEscolares}
        emptyLabel="Todos"
      />

      <FilterSelect
        label="Ciclo Escolar Final"
        value={filters.ciclo_escolar_final}
        onChange={(val) => handleChange('ciclo_escolar_final', val)}
        options={filterOptions.ciclosEscolares}
        emptyLabel="Todos"
      />
    </div>
  );
};

export default StatsFilters;
export { FilterSelect };