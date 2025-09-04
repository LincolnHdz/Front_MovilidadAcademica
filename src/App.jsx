import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import facultad from "./Img/facultad.png";
import "./App.css";
import Navigation from "./components/Navigation";
import ConvocatoriasSlider from "./components/ConvocatoriasSlider";
import ConvocatoriasPage from "./pages/ConvocatoriasPage";
import MovilidadPresencial from "./pages/MovilidadPresencial";

const HomePage = () => {
  return (
    <div>
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

     
      <section id="convocatorias" className="section">
        <ConvocatoriasSlider />
      </section>

      
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
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/convocatorias-lista" element={<ConvocatoriasPage />} />
        <Route path="/movilidad-presencial" element={<MovilidadPresencial />} />
      </Routes>
    </Router>
  );
}
