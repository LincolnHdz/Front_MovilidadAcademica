import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import api from "../api/axiosConfig";

const RegisterPage = () => {
  const [form, setForm] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
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
    // Validar que todos los campos obligatorios estén presentes
    const { nombres, apellido_paterno, apellido_materno, clave, email, password } = form;
    
    if (!nombres || !apellido_paterno || !apellido_materno || !email || !password) {
      setError("Nombres, apellidos, correo y contraseña son obligatorios");
      return;
    }
    
    const res = await api.post("/auth/register", {
      nombres,
      apellido_paterno,
      apellido_materno,
      clave: clave || null,
      email,
      password
    });

    if (res.data.success) {
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(res.data.message || "Error de registro");
    }
  } catch (error) {
    console.error("Error en el registro:", error.response?.data?.message || error.message);
    setError(error.response?.data?.message || "Error de conexión");
  }
};

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Registro</h2>
        <input name="nombres" type="text" placeholder="Nombres" value={form.nombres} onChange={handleChange} required />
        <input name="apellido_paterno" type="text" placeholder="Apellido Paterno" value={form.apellido_paterno} onChange={handleChange} required />
        <input name="apellido_materno" type="text" placeholder="Apellido Materno" value={form.apellido_materno} onChange={handleChange} required />
        <input name="clave" type="text" placeholder="Clave (opcional)" value={form.clave} onChange={handleChange} />
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
