import React from "react";
import ConvocatoriasList from "../components/ConvocatoriasList";
import "./ConvocatoriasPage.css";

const ConvocatoriasPage = () => {
  return (
    <div className="convocatorias-page">
      <div className="page-header">
        <h1>Gestión de Convocatorias</h1>
        <p>Administra todas las convocatorias de movilidad académica</p>
      </div>
      <ConvocatoriasList />
    </div>
  );
};

export default ConvocatoriasPage;
