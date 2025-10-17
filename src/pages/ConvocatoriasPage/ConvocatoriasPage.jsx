
import React from "react";
import ConvocatoriasList from "../../components/ConvocatoriasList";
import "./ConvocatoriasPage.css";
import { useAuth } from "../../context/useAuth";


const ConvocatoriasPage = () => {
  const { user } = useAuth();
  const isAdminOrBecario = user && (user.rol === "administrador" || user.rol === "becarios");
  return (
    <div className="convocatorias-page">
      {isAdminOrBecario && (
        <div className="page-header">
          <h1>Gestión de Convocatorias</h1>
          <p>Administra todas las convocatorias de movilidad académica</p>
        </div>
      )}
      <ConvocatoriasList />
    </div>
  );
};

export default ConvocatoriasPage;
