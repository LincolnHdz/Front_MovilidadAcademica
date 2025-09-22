import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(text || `HTTP ${res.status}`);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      const res = await fetch("http://localhost:3000/api/users/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await parseResponse(res);
      if (!res.ok || !data.success) throw new Error(data.message || "Error");
      setUsers(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, rol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      const res = await fetch(`http://localhost:3000/api/users/${userId}/rol`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rol }),
      });
      const data = await parseResponse(res);
      if (!res.ok || !data.success) throw new Error(data.message || "Error");
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.data : u)));
    } catch (e) {
      alert("No se pudo actualizar el rol: " + e.message);
    }
  };

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user?.rol]);

  if (user?.rol !== "administrador") {
    return (
      <div style={{ padding: 24 }}>
        <h2>Acceso denegado</h2>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Usuarios</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Nombre
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Email
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Clave
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Rol
              </th>
              <th
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                  padding: 8,
                }}
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 8 }}>{u.id}</td>
                <td style={{ padding: 8 }}>
                  {u.nombres} {u.apellidos}
                </td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.clave}</td>
                <td style={{ padding: 8 }}>{u.rol}</td>
                <td style={{ padding: 8 }}>
                  <select
                    value={u.rol}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                  >
                    <option value="alumno">alumno</option>
                    <option value="becarios">becarios</option>
                    <option value="administrador">administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
