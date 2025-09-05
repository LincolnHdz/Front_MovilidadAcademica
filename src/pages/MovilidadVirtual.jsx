import React, { useState } from "react";
import {
  Video,
  FileText,
  Users,
  Globe,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";
import "./MovilidadVirtual.css";

const MovilidadVirtual = () => {
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
      title:
        "Haber cursado el mínimo de semestres requeridos de tu Facultad, Coordinación o Unidad Académica Multidisciplinaria",
      detail:
        "Según tu Facultad, Coordinación o Unidad Académica Multidisciplinaria",
    },
    {
      id: 3,
      title: "Tener promedio general aprobatorio",
      detail: "Mantener estatus activo en la universidad",
    },
    {
      id: 4,
      title:
        "Cursar al menos una materia en tu Facultad, Coordinación o Unidad Académica Multidisciplinaria",
      detail:
        "NOTA: La UNAM solicita promedio de 8.5 en algunas carreras, favor de consultar los requisitos específicos.",
    },
    {
      id: 5,
      title: "Enviar en tiempo y forma documentación requerida",
      detail: "A tu asesor de movilidad para su revisión",
    },
  ];

  const documents = [
    {
      id: 1,
      title:
        "Formato de equivalemcia de materias a cursar en la Institución destino, firmado por el Secretario (a) Académico (a) y Coordinador de Carrera de tu Facultad, Coordinación o Unidad Académica Multidisciplinaria.",
      link: "https://uaslpedu-my.sharepoint.com/personal/internacionalizacion_uaslp_mx/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Finternacionalizacion%5Fuaslp%5Fmx%2FDocuments%2FFORMATOS%2001%2D2023%2FEDITABLE%5FEquivalencia%20de%20materias%5F2023%2Epdf&parent=%2Fpersonal%2Finternacionalizacion%5Fuaslp%5Fmx%2FDocuments%2FFORMATOS%2001%2D2023&ga=1",
    },
    {
      id: 2,
      title: "Historial académico con promedio aprobatorio (Kardex)",
    },
    {
      id: 3,
      title:
        "Carta de exposición de motivos donde menciones las razones por las que deseas estudiar en la Institución destino.",
    },
    {
      id: 4,
      title:
        "Copia de credencial de estudiante por ambos lados (tu credencial debe de estar firmada por la parte de atrás). En caso de no contar con la credencial de la UASLP, copia de la credencial del INE",
    },
    {
      id: 5,
      title:
        "Certificado oficial de dominio del idioma de la Institución destino, si aplica.",
    },
  ];

  const contacts = [
    {
      name: "MAGP. Claudia Isabel Morales Loredo",
      role: "Dirección de Internacionalización",
      areas: "Asesora de estudiantes Movilidad Virtual",
      email: "virtual.internacional@uaslp.mx",
      phone: "444 826 23 00 Ext. 7174",
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
            <h1>Progrmama de Movilidad Virtual</h1>
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
              <h2>¿Qué es la Movilidad Virtual?</h2>
              <div className="overview-card">
                <p>
                  La movilidad virtual es la posibilidad de realizar parte de
                  tus estudios en otra Institución de Educación Superior, a
                  través de la metodología de educación a distancia, utilizando
                  tecnologías de información para facilitar el intercambio y
                  colaboración académica. Dirigida a todos aquellos estudiantes
                  que por diversos motivos no tienen acceso a un programa de
                  movilidad convencional o desean complementar su formación
                  profesional sin recurrir a la presencialidad.
                </p>
              </div>
              <h2>Objetivo</h2>
              <div className="overview-card">
                <p>
                  Multiplicar los escenarios del aprendizaje a los que
                  normalmente no se tendría acceso en un modelo educativo
                  tradicional, generando experiencias académicas nacionales e
                  internacionales para los estudiantes y fundamentada por
                  convenios con otras instituciones participantes.
                </p>
              </div>
              <h2>Ventajas y beneficios</h2>
              <div className="overview-card">
                <p>
                  Reducción de los gastos de traslado al no tener necesidad de
                  desplazarse a la universidad destino.
                </p>
                <p>
                  Permite establecer contacto con estudiantes y docentes de
                  otras ciudades y países, conociendo puntos de vista de otros
                  entornos académicos y metodologías de estudio distintas a las
                  propias participando en nuevos escenarios de aprendizaje.
                </p>
                <p>
                  Adquisición de competencias globales que contribuyen al
                  desarrollo de los estudiantes ampliando sus opciones
                  curriculares y profesionales.
                </p>
              </div>
              <div className="quick-links">
                <a
                  href="https://emovies.oui-iohe.org/movilidad-vitual/"
                  className="quick-link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="link-icon" />
                  Ver Catálogo de Universidades
                </a>
                <a
                  href="https://youtu.be/U-Dno_pQq2Q?si=IRgS7uK9fripLs_f"
                  className="quick-link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Video className="link-icon" />
                  Video tutorial
                </a>
              </div>
            </section>
          )}

          {activeSection === "requirements" && (
            <section className="content-section">
              <h2>Requisitos para Participar</h2>
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
                            Descargar PDF
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

export default MovilidadVirtual;
