
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./Filter.css";

export default function Filtros() {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [becas, setBecas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="filtros-container">
      {loading && <p>Cargando filtros...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Universidad */}
      <div className="filter-item">
        <label>Universidad</label>
        <select>
          {universidades.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Facultades */}
      <div className="filter-item">
        <label>Facultades</label>
        <select>
          {facultades.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </div>

      {/* Carreras */}
      <div className="filter-item">
        <label>Carreras</label>
        <select>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Becas */}
      <div className="filter-item">
        <label>Becas</label>
        <select>
          {becas.map((b) => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
