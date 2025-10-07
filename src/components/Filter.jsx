import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Filter.css";

export default function Filtros({ onApply, onClose }) {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [becas, setBecas] = useState([]);
  const [tipoMovilidadOptions, setTipoMovilidadOptions] = useState([]);
  const [ciclosOptions, setCiclosOptions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // selecciones controladas
  const [selUniversidad, setSelUniversidad] = useState("");
  const [selFacultad, setSelFacultad] = useState("");
  const [selCarrera, setSelCarrera] = useState("");
  const [selBeca, setSelBeca] = useState("");
  const [selTipoMovilidad, setSelTipoMovilidad] = useState("");
  const [selCicloEscolar, setSelCicloEscolar] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const cacheBuster = { params: { _: Date.now() } };

        const [
          uRes,
          fRes,
          cRes,
          bRes,
          tmRes,
          ciclosRes
        ] = await Promise.all([
          api.get("/filters/universidades", cacheBuster),
          api.get("/filters/facultades", cacheBuster),
          api.get("/filters/carreras", cacheBuster),
          api.get("/filters/becas", cacheBuster),
          api.get("/filters/tipo-movilidad", cacheBuster),
          api.get("/filters/ciclos", cacheBuster),
        ]);

        // En caso de 304 axios aún resuelve; fallback a [] si no hay body
        setUniversidades(uRes.data?.data || []);
        setFacultades(fRes.data?.data || []);
        setCarreras(cRes.data?.data || []);
        setBecas(bRes.data?.data || []);
        setTipoMovilidadOptions(tmRes.data?.data || []);
        setCiclosOptions(ciclosRes.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const applyFilters = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (selUniversidad) params.universidad_id = selUniversidad;
      if (selFacultad) params.facultad_id = selFacultad;
      if (selCarrera) params.carrera_id = selCarrera;
      if (selBeca) params.beca_id = selBeca;
      if (selTipoMovilidad) params.tipo_movilidad = selTipoMovilidad;
      if (selCicloEscolar) params.ciclo_escolar = selCicloEscolar;

      const res = await api.get("/users/search", { params });
      const users = res.data?.data || [];
      if (typeof onApply === "function") onApply(users);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="filtros-container">
      {loading && <p className="loading">Cargando filtros...</p>}
      {error && <p className="error">{error}</p>}

      <div className="filter-item">
        <label>Universidad</label>
        <div className="select-wrapper">
          <select value={selUniversidad} onChange={(e) => setSelUniversidad(e.target.value)}>
            <option value="">-- Todas --</option>
            {universidades.map((u) => (
              <option key={u.id} value={u.id}>{u.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-item">
        <label>Facultad</label>
        <div className="select-wrapper">
          <select value={selFacultad} onChange={(e) => setSelFacultad(e.target.value)}>
            <option value="">-- Todas --</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-item">
        <label>Carrera</label>
        <div className="select-wrapper">
          <select value={selCarrera} onChange={(e) => setSelCarrera(e.target.value)}>
            <option value="">-- Todas --</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-item">
        <label>Beca</label>
        <div className="select-wrapper">
          <select value={selBeca} onChange={(e) => setSelBeca(e.target.value)}>
            <option value="">-- Todas --</option>
            {becas.map((b) => (
              <option key={b.id} value={b.id}>{b.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nueva fila: tipo movilidad */}
      <div className="filter-item">
        <label>Tipo de movilidad</label>
        <div className="select-wrapper">
          <select value={selTipoMovilidad} onChange={(e) => setSelTipoMovilidad(e.target.value)}>
            <option value="">-- Todas --</option>
            {tipoMovilidadOptions.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nueva fila: ciclo escolar */}
      <div className="filter-item">
        <label>Ciclo escolar</label>
        <div className="select-wrapper">
          <select value={selCicloEscolar} onChange={(e) => setSelCicloEscolar(e.target.value)}>
            <option value="">-- Todos --</option>
            {ciclosOptions.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-actions">
        <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
        <button className="btn btn-primary" onClick={applyFilters} disabled={loading}>Aplicar filtros</button>
      </div>
    </div>
  );
}
