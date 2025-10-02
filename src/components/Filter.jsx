import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Filter.css";

export default function Filtros({ onApply, onClose }) {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [becas, setBecas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // selecciones controladas
  const [selUniversidad, setSelUniversidad] = useState("");
  const [selFacultad, setSelFacultad] = useState("");
  const [selCarrera, setSelCarrera] = useState("");
  const [selBeca, setSelBeca] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Llamadas en paralelo
        const [u, f, c, b] = await Promise.all([
          api.get("/filters/universidades"),
          api.get("/filters/facultades"),
          api.get("/filters/carreras"),
          api.get("/filters/becas"),
        ]);

        setUniversidades(u.data);
        setFacultades(f.data);
        setCarreras(c.data);
        setBecas(b.data);
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

      {/* Universidad */}
      <div className="filter-item">
        <label>Universidad</label>
        <select value={selUniversidad} onChange={(e) => setSelUniversidad(e.target.value)}>
          <option value="">-- Todas --</option>
          {universidades.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Facultades */}
      <div className="filter-item">
        <label>Facultades</label>
        <select value={selFacultad} onChange={(e) => setSelFacultad(e.target.value)}>
          <option value="">-- Todas --</option>
          {facultades.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </div>

      {/* Carreras */}
      <div className="filter-item">
        <label>Carreras</label>
        <select value={selCarrera} onChange={(e) => setSelCarrera(e.target.value)}>
          <option value="">-- Todas --</option>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Becas */}
      <div className="filter-item">
        <label>Becas</label>
        <select value={selBeca} onChange={(e) => setSelBeca(e.target.value)}>
          <option value="">-- Todas --</option>
          {becas.map((b) => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 12 }} className="buttons">
        <button onClick={applyFilters} disabled={loading}>Aplicar filtros</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>Cerrar</button>
      </div>
    </div>
  );
}
