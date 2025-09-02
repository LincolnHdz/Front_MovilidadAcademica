import React from "react";
import logo from "../../Front_MovilidadAcademica/src/Img/logoUni.jpg";
import facultad from "../../Front_MovilidadAcademica/src/Img/facultad.jpg";
import "./App.css";

export default function App() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="UASLP" style={{ height: "50px", width: "auto" }} />
        </div>
        <nav>
          <a href="#facultad">Facultad</a>
          <a href="#programas">Programas</a>
          <a href="#convocatorias">Convocatorias</a>
          <a href="#experiencias">Experiencias</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${facultad})`,
        }}
      >
        <div className="overlay">
          <h2>Movilidad Académica - Facultad de Ingeniería</h2>
          <p>
            Impulsando experiencias internacionales para estudiantes y docentes
            de Ingeniería.
          </p>
        </div>
      </section>

      {/* Programas */}
      <section id="programas" className="section">
        <h3>Programas de Movilidad</h3>
        <p>
          Conoce nuestras oportunidades de intercambio y convenios con
          universidades en todo el mundo.
        </p>
        <div className="cards">
          <div className="card">
            <h4>Intercambio Académico</h4>
            <p>Convenios con universidades de América, Europa y Asia.</p>
          </div>
          <div className="card">
            <h4>Movilidad de Investigación</h4>
            <p>
              Colabora en proyectos de ingeniería con instituciones de prestigio
              internacional.
            </p>
          </div>
          <div className="card">
            <h4>Prácticas Profesionales</h4>
            <p>
              Realiza prácticas en empresas y organismos internacionales de
              ingeniería.
            </p>
          </div>
        </div>
      </section>

      {/* Convocatorias */}
      <section id="convocatorias" className="section">
        <h3>Convocatorias Vigentes</h3>
        <ul>
          <li>
            <strong>Convocatoria Erasmus+ 2025</strong> — Inscripciones hasta el
            30 de septiembre.
          </li>
          <li>
            <strong>Convenio con Universidades de Quebec</strong> — Fecha
            límite: 15 de octubre.
          </li>
        </ul>
      </section>

      {/* Experiencias */}
      <section id="experiencias" className="section">
        <h3>Experiencias de Estudiantes</h3>
        <div className="cards">
          <div className="card">
            <p>
              "Mi experiencia en Alemania fue increíble. Aprendí mucho sobre
              ingeniería y conocí personas de todo el mundo."
            </p>
            <span>— Ana Pérez, Ingeniería Mecánica</span>
          </div>
          <div className="card">
            <p>
              "El intercambio en Argentina me ayudó a crecer académica y
              personalmente dentro de mi carrera."
            </p>
            <span>— Luis Hernández, Ingeniería en Sistemas</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} UASLP - Facultad de Ingeniería. Todos los
          derechos reservados.
        </p>
      </footer>
    </div>
  );
}
