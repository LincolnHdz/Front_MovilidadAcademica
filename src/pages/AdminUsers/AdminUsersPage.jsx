import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import "./AdminUsersPage.css";

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      
      // Configurar el token para esta petición
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Haciendo petición a:", `${import.meta.env.VITE_API_URL}/users/all`);
      
      // Usar axios (api) para hacer la petición
      const response = await api.get("/users/all", config);
      
      console.log("Respuesta completa:", response);
      
      // axios ya parsea automáticamente la respuesta JSON
      const { data } = response;
      
      console.log("Datos recibidos:", data);
      
      if (!data || !data.success) throw new Error(data?.message || "Error en la respuesta");
      
      // Verificar que data.data es un array
      if (!Array.isArray(data.data)) {
        console.warn("La respuesta no contiene un array:", data.data);
        setUsers([]);
        return;
      }
      
      setUsers(data.data);
    } catch (e) {
      console.error("Error al obtener usuarios:", e);
      console.error("Detalles del error:", {
        message: e.message,
        response: e.response,
        status: e.response?.status,
        statusText: e.response?.statusText
      });
      setError(e.response?.data?.message || e.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, rol) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      
      // Configurar el token para esta petición
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      // Usar axios para hacer la petición PATCH
      const response = await api.patch(`/users/${userId}/rol`, { rol }, config);
      
      // axios ya parsea automáticamente la respuesta JSON
      const { data } = response;
      
      if (!data.success) throw new Error(data.message || "Error");
      
      // Actualizar el usuario en la lista
      setUsers((prev) => prev.map((u) => (u.id === userId ? data.data : u)));
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`Rol actualizado correctamente para ${data.data.nombres}`);
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (e) {
      console.error("Error al actualizar rol:", e);
      setError("No se pudo actualizar el rol: " + (e.response?.data?.message || e.message || "Error de conexión"));
      
      // Ocultar el mensaje de error después de 5 segundos
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user?.rol]);

  const handleRefresh = () => {
    fetchUsers();
  };

  if (user?.rol !== "administrador") {
    return (
      <div className="access-denied">
        <h2>Acceso denegado</h2>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div className="admin-users-container">
      <div className="admin-page-header">
        <h1 className="admin-title">Administración de Usuarios</h1>
        <button className="refresh-button" onClick={handleRefresh} disabled={loading}>
          {loading ? "Actualizando..." : "↻ Actualizar lista"}
        </button>
      </div>
      
      {loading && (
        <div className="loading-spinner">
          <div>Cargando usuarios...</div>
        </div>
      )}
      
      {error && (
        <div className="status-message error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {successMessage && (
        <div className="status-message success-message">
          <strong>Éxito:</strong> {successMessage}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre completo</th>
                  <th>Correo electrónico</th>
                  <th>Clave</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(users) ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No hay datos de usuarios disponibles
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <strong>{u.nombres} {u.apellido_paterno} {u.apellido_materno || ''}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.clave}</td>
                      <td>
                        <span className={`user-role role-${u.rol}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td>
                        <div className="action-container">
                          <select
                            className="select-role"
                            value={u.rol}
                            onChange={(e) => handleChangeRole(u.id, e.target.value)}
                            title="Cambiar rol de usuario"
                          >
                            <option value="alumno">Alumno</option>
                            <option value="becarios">Becario</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="users-stats">
            <p className="total-users">
              <span>Total de usuarios:</span> 
              <strong>{Array.isArray(users) ? users.length : 0}</strong>
            </p>
            {Array.isArray(users) && users.length > 0 && (
              <div className="role-stats">
                <div className="role-stat">
                  <span>Alumnos:</span>
                  <strong>{users.filter(u => u.rol === 'alumno').length}</strong>
                </div>
                <div className="role-stat">
                  <span>Becarios:</span>
                  <strong>{users.filter(u => u.rol === 'becarios').length}</strong>
                </div>
                <div className="role-stat">
                  <span>Administradores:</span>
                  <strong>{users.filter(u => u.rol === 'administrador').length}</strong>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsersPage;
