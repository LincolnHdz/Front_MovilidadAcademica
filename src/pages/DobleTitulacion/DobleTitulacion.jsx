import React, { useState } from "react";
import imgMovilidad from '../../Img/becaCityU.jpeg';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Globe,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";
import "./DobleTitulacion.css";

const DobleTitulacion = () => {
  //Estado que controla la sección activa
  const [activeSection, setActiveSection] = useState("overview");
  //Estado que controla el estado de la sección de requisitos
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  //Estado que controla el estado de la sección de documentos
  const [expandedDocument, setExpandedDocument] = useState(null);

  const requirements = [
    {
      id: 1,
      title: "Ser estudiante activo REGULAR de la UASLP",
      detail: "Requisito fundamental para participar en el programa",
    },
    {
      id: 2,
      title: "Estar inscrito en una carrera que sea parte del Programa de Doble Titulación",
      detail: "Descubre si tu carrera es parte del programa mediante la encuesta en el apartado de Documentos",
    },
    {
      id: 3,
      title: "Tener una acreditación con un minimo de 540 puntos de TOEFL",
      detail: "El alumno deberá contar con una acreditación vigente",
    },
    {
      id: 4,
      title: "Haber cursado minimo 3 semestres para empezar a cursar las materias en la CityU",
      detail: "Si así lo desea puede empezar a hacer pagos mensuales tan pronto ingrese a la UASLP",
    },
  ];

  const documents = [
    {
      id: 1,
      title: "Convocatoria CityU 2025",
      link: "https://u.uaslp.mx/cityu2025",
    },
    {
      id: 2,
      title: "¿Tu Carrera es Parte del Programa de Doble Titulación?",
      link: "https://docs.google.com/forms/d/e/1FAIpQLSfFWvnPjl9Ab43u5jI0gQCUTNFxsBO-UL6A8BJ9MX5ytRiMXw/viewform"
    },
  ];

  const contacts = [
    {
      name: "LAE. Mariela Guadalupe Chávez Ramírez",
      role: "Directora de Internacionalización",
      areas: "Edificio de Finanzas de la UASLP, 1er Piso",
      email: "mariela.chavez@uaslp.mx",
      phone: "444 826 23 00 Ext. 7170",
    },
    {
      name: "Ing. Oscar Colunga Chavez",
      role: "Reclutador de CityU",
      areas: "Facultad de Ingeniería, Edificio L, 1er Piso",
      email: "colungaoscar@cityu.edu",
      phone: "444 826 23 00 Ext. 6055",
    },
  ];

  const menuItems = [
    { id: "overview", label: "Información General", icon: Globe },
    { id: "requirements", label: "Requisitos", icon: CheckCircle },
    { id: "documents", label: "Documentos", icon: FileText },
    { id: "contacts", label: "Contactos", icon: Phone },
  ];

  return (
    <div className="mobility-container">
      <header className="mobility-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Programa de Doble Titulación</h1>
            <p>Universidad Autónoma de San Luis Potosí</p>
          </div>
        </div>
      </header>

      <div className="mobility-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${
                    activeSection === item.id ? "active" : ""
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="main-content">
          {activeSection === "overview" && (
            <section className="content-section">
              <h2>Objetivo</h2>
              <div className="overview-card">
                <p>
                  El objetivo de este programa es ofrecer a los alumnos, 
                  la alternativa de egresar con dos títulos universitarios en 
                  un mismo tiempo.
                </p>
              </div>
              <img src={imgMovilidad} alt="Beca CityU 2025" className="overview-image" />
              <div className="overview-card">
                <p>
                  ¡Sé un profesional para el mundo! Obtén dos títulos al mismo tiempo, 
                  en San Luis Potosí y en Estados Unidos. Además de vivir la experiencia 
                  de cursar materias y vivir un verano en USA y en la Republica Checa.
                </p>
              </div>
              <h2>Los servicios que brindamos son</h2>
              <div className="overview-card">
                <p>
                  • Asesoría en la inscripción al programa.
                </p>
                <p>
                  • Asesoría de las materias a cursar tanto en la UASLP como en CityU.
                </p>
                <p>
                  • Inscripción en las materias de CityU.
                </p>
                <p>
                  • Control de los pagos por los cursos tomados.
                </p>
                <p>
                  • La totalidad de trámites para asistir un verano a cursar materias en CityU, además de lo relacionado con la Graduación.
                </p>
              </div>
            </section>
          )}

          {activeSection === 'requirements' && (
            <section className="content-section">
              <h2>Requisitos para Participar</h2>
              <div className="requirements-grid">
                {requirements.map((req) => (
                  <div key={req.id} className="requirement-card">
                    <div 
                      className="requirement-header"
                      onClick={() => setExpandedRequirement(expandedRequirement === req.id ? null : req.id)}
                    >
                      <div className="requirement-number">{req.id}</div>
                      <h3>{req.title}</h3>
                      {expandedRequirement === req.id ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    {expandedRequirement === req.id && (
                      <div className="requirement-detail">
                        <p>{req.detail}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "documents" && (
            <section className="content-section">
              <h2>Documentos y Formatos Requeridos</h2>
              <div className="documents-list">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div
                      className="document-header"
                      onClick={() =>
                        setExpandedDocument(
                          expandedDocument === doc.id ? null : doc.id
                        )
                      }
                    >
                      <FileText className="document-icon" />
                      <div className="document-info">
                        <h3>{doc.title}</h3>
                        {doc.link && (
                          <a
                            href={doc.link}
                            className="download-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visitar Enlace
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "contacts" && (
            <section className="content-section">
              <h2>Informes y trámites</h2>

              <div className="contacts-grid">
                {contacts.map((contact, index) => (
                  <div key={index} className="contact-card">
                    <div className="contact-header">
                      <Users className="contact-icon" />
                      <div>
                        <h3>{contact.name}</h3>
                        <p className="contact-role">{contact.role}</p>
                      </div>
                    </div>
                    <div className="contact-details">
                      <p>
                        <strong>Área:</strong> {contact.areas}
                      </p>
                      <div className="contact-links">
                        {/* Para abrir el correo */}
                        <a
                          href={`mailto:${contact.email}`}
                          className="contact-link"
                        >
                          <Mail className="contact-link-icon" />
                          {contact.email}
                        </a>
                        {/* Para abrir el teléfono */}
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                          className="contact-link"
                        >
                          <Phone className="contact-link-icon" />
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default DobleTitulacion;
