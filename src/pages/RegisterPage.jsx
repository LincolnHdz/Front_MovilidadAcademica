import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import api from "../api/axiosConfig";

const RegisterPage = () => {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    clave: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  try {
    const res = await api.post("/auth/register", form);

    if (res.data.success) {
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(res.data.message || "Error de registro");
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    setError("Error de conexión");
  }
};

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Registro</h2>
        <input name="nombres" type="text" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="apellidos" type="text" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} required />
        <input name="clave" type="text" placeholder="Clave" value={form.clave} onChange={handleChange} required />
        {/* El campo teléfono se elimina del registro, se agregará en el perfil */}
        <input name="email" type="email" placeholder="Correo institucional" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <button type="submit">Registrarse</button>
        <p>
          ¿Ya tienes cuenta? <span className="auth-link" onClick={() => navigate("/login")}>Inicia sesión</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
