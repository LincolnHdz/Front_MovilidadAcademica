import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./LoginRegister.css";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        // Usar el login del contexto para guardar el token y datos del usuario
        login(data.data.token, data.data.user);
        navigate("/");
      } else {
        setError(data.message || "Error de login");
      }
    } catch (error) {
        console.error('Error en el login:', error);
      setError("Error de conexión");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form large-form" onSubmit={handleLogin}>
        <h2>Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Correo o clave"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input"
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit">Entrar</button>
        <p>
          ¿No tienes cuenta? <span className="auth-link" onClick={() => navigate("/register")}>Regístrate</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
