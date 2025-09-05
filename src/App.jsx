import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import facultad from "./Img/facultad.png";
import "./App.css";
import "./i18n";
import { useTranslation } from "react-i18next";
import Navigation from "./components/Navigation";
import ConvocatoriasSlider from "./components/ConvocatoriasSlider";
import ConvocatoriasPage from "./pages/ConvocatoriasPage";
import MovilidadPresencial from "./pages/MovilidadPresencial";
import MovilidadVirtual from "./pages/MovilidadVirtual";
import MovAcadFormatos from "./pages/MovAcadFormatos";
import DeptoRelInter from "./pages/DeptoRelInter";

const HomePage = () => {
  const { t } = useTranslation();
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
          <h2>{t("hero.title")}</h2>
          <p>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Programas */}
      <section id="programas" className="section">
        <h3>{t("programas.title")}</h3>
        <p>
          {t("programas.description")}
        </p>
        <div className="cards">
          <div className="card">
            <h4>{t("programas.cards.intercambio.title")}</h4>
            <p>{t("programas.cards.intercambio.text")}</p>
          </div>
          <div className="card">
            <h4>{t("programas.cards.investigacion.title")}</h4>
            <p>{t("programas.cards.investigacion.text")}</p>
          </div>
          <div className="card">
            <h4>{t("programas.cards.practicas.title")}</h4>
            <p>{t("programas.cards.practicas.text")}</p>
          </div>
        </div>
      </section>

     
      <section id="convocatorias" className="section">
        <ConvocatoriasSlider />
      </section>

      
      <section id="experiencias" className="section">
        <h3>{t("experiencias.title")}</h3>
        <div className="cards">
          <div className="card">
            <p>
              {t("experiencias.cards.0.text")}
            </p>
            <span>{t("experiencias.cards.0.author")}</span>
          </div>
          <div className="card">
            <p>
              {t("experiencias.cards.1.text")}
            </p>
            <span>{t("experiencias.cards.1.author")}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      {/* <Navigation /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/convocatorias-lista" element={<ConvocatoriasPage />} />
        <Route path="/movilidad-presencial" element={<MovilidadPresencial />} />
        <Route path="/movilidad-virtual" element={<MovilidadVirtual />} />
        <Route path="/MovAcadFormatos" element={<MovAcadFormatos />} />
        <Route path="/deptoRelInter" element={<DeptoRelInter />} />
      </Routes>
    </Router>
  );
}
