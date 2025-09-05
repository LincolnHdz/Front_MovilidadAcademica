import React, { useState } from "react";
import imgMovilidad from '../Img/becaEIFFEL.png';
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
import "./BecasParaFrancia.css";

const BecasParaFrancia = () => {
  //Estado que controla la sección activa
  const [activeSection, setActiveSection] = useState("overview");
  //Estado que controla el estado de la sección de requisitos
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  //Estado que controla el estado de la sección de documentos
  const [expandedDocument, setExpandedDocument] = useState(null);

  const requirements = [
    {
      id: 1,
      title: "Promedio MINIMO de 9.0",
    },
    {
      id: 2,
      title: "Francés B1",
    },
    {
      id: 3,
      title: "Estar en 5to semestre en adelante",
    },
    {
      id: 4,
      title: "CV",
    },
    {
      id: 5,
      title: "Carta de motivos",
    },
    {
      id: 6,
      title: "Cartas de recomendación",
    },
    {
      id: 7,
      title: "Kardex",
    },
    {
      id: 8,
      title: "Certificación de inglés",
    },
    {
      id: 9,
      title: "Certificación de Francés",
    },
    {
      id: 10,
      title: "Carta del director",
    },
  ];

  const documents = [
  ];

  const contacts = [
    {
      name: "LCC. Rosa María Martínez García",
      role: "Enlace del Programa de Movilidad en la Facultad de Ingeniería",
      areas: "Facultad de Ingeniería, Edificio P, Planta Baja",
      email: "rosma.garcia@uaslp.mx",
      phone: "444 826 23 00 Ext. 6277",
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
            <h1>Convocatoria a Becas para Francia por parte de EIFFEL</h1>
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
              <img src={imgMovilidad} alt="Beca EIFFEL" className="overview-image" />
              <h2>Calendario de Actividades</h2>
              <h3>Marzo</h3>
              <div className="overview-card">
                <p>
                  • Inicio de clases de francés para principiantes. 
                  Alumnos de 2do o 4to semestre. (opcional)
                </p>
              </div>
              <h3>Octubre</h3>
              <div className="overview-card">
                <p>
                  • Registro de alumnos que quieren aplicar a Eiffel con el 
                  departamento de Relaciones Internacionales de la Facultad de Ingeniería.
                </p>
              </div>
              <h3>Noviembre</h3>
              <div className="overview-card">
                <p>
                  • Entrevista en francés con un profesor de las Escuelas 
                  Centrales (Preselección Eiffel).
                </p>
              </div>
              <h3>Diciembre</h3>
              <div className="overview-card">
                <p>
                  • Resultados de la preselección. Los seleccionados están 
                  aceptados en una Escuela Central y van a competir para la beca Eiffel.
                </p>
                <p>
                  • Actualización de los documentos.
                </p>
              </div>
              <h3>Abril/Mayo</h3>
              <div className="overview-card">
                <p>
                  • Resultados Eiffel a finales de marzo o principios de abril.
                </p>
              </div>
              <h3>Junio</h3>
              <div className="overview-card">
                <p>
                  • Registro en Campus France y tramite de Visa
                </p>
              </div>
            </section>
          )}

          {activeSection === "requirements" && (
            <section className="content-section">
              <h2>Requisitos Solicitados por el EIFFEL</h2>
              <div className="requirements-grid">
                {requirements.map((req) => (
                  <div key={req.id} className="requirement-card">
                    <div
                      className="requirement-header"
                      onClick={() =>
                        setExpandedRequirement(
                          expandedRequirement === req.id ? null : req.id
                        )
                      }
                    >
                      <div className="requirement-number">{req.id}</div>
                      <h3>{req.title}</h3>
                    </div>
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

export default BecasParaFrancia;
