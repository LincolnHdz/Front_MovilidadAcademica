import { useEffect, useState } from "react";
import "./Filter.css"; // Importamos el CSS

export default function Filtros() {
  const [universidades, setUniversidades] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [becas, setBecas] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/universidades`).then(res => res.json()).then(setUniversidades);
    fetch(`${apiUrl}/facultades`).then(res => res.json()).then(setFacultades);
    fetch(`${apiUrl}/carreras`).then(res => res.json()).then(setCarreras);
    fetch(`${apiUrl}/becas`).then(res => res.json()).then(setBecas);
  }, [apiUrl]);

  return (
    <div className="filtros-container">
      {/* Universidad */}
      <div className="filter-item">
        <label>Universidad</label>
        <input type="text" placeholder="Escribir..." />
        <select>
          {universidades.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Facultades */}
      <div className="filter-item">
        <label>Facultades</label>
        <input type="text" placeholder="Escribir..." />
        <select>
          {facultades.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </div>

      {/* Carreras */}
      <div className="filter-item">
        <label>Carreras</label>
        <input type="text" placeholder="Escribir..." />
        <select>
          {carreras.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      {/* Becas */}
      <div className="filter-item">
        <label>Becas</label>
        <input type="text" placeholder="Escribir..." />
        <select>
          {becas.map((b) => (
            <option key={b.id} value={b.id}>{b.nombre}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
