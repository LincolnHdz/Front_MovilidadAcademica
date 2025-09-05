import React from "react";
import "./MovAcadFormatos.css";


const MovAcadFormatos = () => {
  return (
        <div className="movilidad-container">
      {/* Hero */}
      <section
        className="hero"
      >
        <div className="overlay">
          <h2>Movilidad Académica Nacional e Internacional</h2>
          <p>
            Impulsamos el desarrollo académico y profesional de nuestros
            estudiantes a través de experiencias nacionales e internacionales.
          </p>
        </div>
      </section>

      {/* Información */}
      <section className="info">
        <h3>¿Qué es la movilidad académica?</h3>
        <p>
          Es un programa que permite a los estudiantes de la Facultad de
          Ingeniería participar en intercambios académicos dentro y fuera del
          país, fortaleciendo su formación integral.
        </p>

        <h4>Funciones Generales</h4>
        <ul>
          <li>Promover la movilidad académica entre los estudiantes.</li>
          <li>Informar sobre programas y convocatorias disponibles.</li>
          <li>Asistir en el proceso de postulación.</li>
          <li>Dar seguimiento durante la experiencia de movilidad.</li>
        </ul>
      </section>

      {/* Formatos */}
      <section className="formatos">
        <h3>Formatos de Movilidad</h3>
        <div className="cards">
          <div className="card">

            <h5>Movilidad Virtual</h5>
          </div>
          <div className="card">
            
            <h5>Movilidad Presencial</h5>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="contacto">
        <h3>Contacto</h3>
        <p><strong>ICC. Rosa María Martínez García</strong></p>
        <p>Responsable del Programa de Movilidad</p>
        <p>Email: <a href="mailto:rosa.martinez@uaslp.mx">rosa.martinez@uaslp.mx</a></p>
        <p>Tel: (444) 826-2330 ext. 8011</p>
        <p>Ubicación: Edificio P, segundo nivel, Facultad de Ingeniería</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} UASLP - Facultad de Ingeniería</p>
      </footer>
    </div>
  );
}

export default MovAcadFormatos;
