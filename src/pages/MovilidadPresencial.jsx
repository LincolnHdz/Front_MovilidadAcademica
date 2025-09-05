import React, { useState } from 'react';
import imgMovilidad from '../Img/convocatoria.jpg';
import { ChevronDown, ChevronRight, FileText, Users, Globe, Phone, Mail, MapPin, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import './MovilidadPresencial.css';

const MovilidadPresencial = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  const [expandedDocument, setExpandedDocument] = useState(null);

  const requirements = [
    {
      id: 1,
      title: "Estar inscrito en algún programa académico de licenciatura de la UASLP",
      detail: "Requisito fundamental para participar en el programa"
    },
    {
      id: 2,
      title: "Haber cursado el mínimo de semestres requeridos",
      detail: "Según tu Facultad, Coordinación o Unidad Académica Multidisciplinaria"
    },
    {
      id: 3,
      title: "Ser alumno regular",
      detail: "Mantener estatus activo en la universidad"
    },
    {
      id: 4,
      title: "Tener promedio general mínimo de 8.0",
      detail: "NOTA: La UNAM solicita promedio de 8.5 en algunas carreras, favor de consultar los requisitos específicos."
    },
    {
      id: 5,
      title: "Entregar documentación requerida",
      detail: "A tu asesor de movilidad para su revisión"
    },
    {
      id: 6,
      title: "Registro en el SIDI",
      detail: "Sistema de registro de movilidad estudiantil"
    },
    {
      id: 7,
      title: "Mantener promedio y estatus hasta iniciar estancia",
      detail: "Promedio mínimo de 8.0 y estatus de alumno regular"
    },
    {
      id: 8,
      title: "Comprobar dominio del idioma",
      detail: "De la institución destino"
    }
  ];

  const documents = [
    {
      id: 1,
      title: "Solicitud del Programa de Movilidad Estudiantil",
      link: "https://uaslpedu-my.sharepoint.com/:b:/g/personal/internacionalizacion_uaslp_mx/EcXvxwWlXn5CuOMorZDsA8kBnNPOiFkhgzvZY4aNaymDng?e=j8d3W9",
      description: "Formato en PDF para llenar a computadora"
    },
    {
      id: 2,
      title: "Historial académico (Kardex)",
      description: "Con promedio general mínimo de 8.0, firmado y sellado por tu Entidad Académica"
    },
    {
      id: 3,
      title: "Formato de equivalencia de materias",
      link: "https://uaslpedu-my.sharepoint.com/:b:/g/personal/internacionalizacion_uaslp_mx/EdFv2dLX2tZOufFkFp0_RO4BmBr7Yf33CL7-v8nQPquoyA?e=vIfuGr",
      description: "Firmado por el Secretario Académico o Coordinador de Carrera"
    },
    {
      id: 4,
      title: "Carta de evaluación académica",
      link: "https://uaslpedu-my.sharepoint.com/:b:/g/personal/internacionalizacion_uaslp_mx/ERHPntAQ5StCuP2YuB2u5nUBAvs_ZtfBhHgg5RjI5eaRLA?e=hPSsCG",
      description: "De un profesor de tu Facultad, Coordinación o UAM"
    },
    {
      id: 5,
      title: "Carta de exposición de motivos",
      description: "En español y en el idioma de la Institución destino"
    },
    {
      id: 6,
      title: "Certificado de idioma",
      description: "Oficial de dominio del idioma (si las materias no son en español)"
    },
    {
      id: 7,
      title: "Carta responsiva de financiamiento",
      description: "Firmada por padre, madre o tutor, con copia de identificación"
    },
    {
      id: 8,
      title: "Credencial de estudiante",
      description: "Copia por ambos lados (firmada al reverso)"
    },
    {
      id: 9,
      title: "Documentos de identidad nacional",
      description: "Copia de INE y cartilla del seguro facultativo"
    },
    {
      id: 10,
      title: "Documentos internacionales",
      description: "Copia de pasaporte vigente (6 meses posteriores al regreso)"
    },
    {
      id: 11,
      title: "CURP",
      description: "Copia de la Clave Única de Registro de Población"
    },
    {
      id: 12,
      title: "Carta de postulación",
      description: "Del Director de tu Facultad, Coordinación o UAM"
    },
    {
      id: 13,
      title: "Registro en SIDI",
      link: "https://internacionalizacion.uaslp.mx/sidi",
      description: "Sistema de registro online"
    }
  ];

  const contacts = [
    {
      name: "LIN. Rocío Saldaña Medina",
      role: "Coordinadora de Movilidad Estudiantil",
      areas: "Norteamérica, Europa, Asia, EIFFEL y Programas Especiales",
      email: "rsaldana@uaslp.mx",
      phone: "444 826 23 00 Ext. 7171"
    },
    {
      name: "LA. Oscar Gerardo Juárez Loredo",
      role: "Asesor de Movilidad",
      areas: "España",
      email: "gerardo.juarez@uaslp.mx",
      phone: "444 826 23 00 Ext. 7175"
    },
    {
      name: "Daniela Elisa Núñez Orozco",
      role: "Asesora de movilidad",
      areas: "América",
      email: "daniela.nunez@uaslp.mx",
      phone: "444 826 23 00 Ext. 7178"
    }
  ];

  const menuItems = [
    { id: 'overview', label: 'Información General', icon: Globe },
    { id: 'requirements', label: 'Requisitos', icon: CheckCircle },
    { id: 'documents', label: 'Documentos', icon: FileText },
    { id: 'process', label: 'Proceso', icon: Users },
    { id: 'contacts', label: 'Contactos', icon: Phone }
  ];

  return (
    <div className="mobility-container">
      <header className="mobility-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Movilidad Presencial</h1>
            <p>Universidad Autónoma de San Luis Potosí</p>
          </div>
          <div className="header-badge">
            <Calendar className="badge-icon" />
            <span>SIDI abierto desde el 26 de agosto, 2025</span>
          </div>
        </div>
      </header>

      <div className="mobility-layout">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
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
          {activeSection === 'overview' && (
            <section className="content-section">
              <h2>¿Qué es la Movilidad Estudiantil?</h2>
              <div className="overview-card">
                <p>
                  La movilidad estudiantil es el desplazamiento de estudiantes de una institución de educación superior 
                  a otra en México o en el extranjero para realizar una parte de su programa académico, con el objetivo 
                  de colaborar y compartir nuestras fortalezas y diferencias como Institución, para proporcionar a los 
                  estudiantes una formación integral con diferentes enfoques educativos.
                </p>
              </div>
              <img src={imgMovilidad} alt="Convocatoria Movilidad Ene-Jun 2026" className="overview-image" />
              <div className="quick-links">
                <a 
                  href="https://www.notion.so/Cat-logo-de-Universidades-para-Movilidad-UASLP-21521ce92d8f8047beecc69e29d62395" 
                  className="quick-link-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="link-icon" />
                  Ver Catálogo de Universidades
                </a>
                <a 
                  href="https://internacionalizacion.uaslp.mx/sidi" 
                  className="quick-link-btn primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Users className="link-icon" />
                  Acceder al SIDI
                </a>
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

          {activeSection === 'documents' && (
            <section className="content-section">
              <h2>Documentos y Formatos Requeridos</h2>
              <div className="documents-list">
                {documents.map((doc) => (
                  <div key={doc.id} className="document-card">
                    <div 
                      className="document-header"
                      onClick={() => setExpandedDocument(expandedDocument === doc.id ? null : doc.id)}
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
                      {expandedDocument === doc.id ? <ChevronDown /> : <ChevronRight />}
                    </div>
                    {expandedDocument === doc.id && (
                      <div className="document-detail">
                        <p>{doc.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === 'process' && (
            <section className="content-section">
              <h2>Proceso de Solicitud</h2>
              
              <div className="process-steps">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>Preparación</h3>
                  <p>Revisa y valida tus documentos con tu asesor de movilidad antes de registrarte en el SIDI.</p>
                </div>
                
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>Registro en SIDI</h3>
                  <p>Completa tu registro en el sistema desde el 26 de agosto, 2025.</p>
                </div>
                
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>Evaluación Médica</h3>
                  <p>Certificado médico y examen psicométrico en el Centro de Salud Universitario (programado por la DI).</p>
                </div>
                
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h3>Seguro Internacional</h3>
                  <p>Para movilidad internacional: adquirir seguro médico de cobertura internacional y repatriación.</p>
                </div>
              </div>

              <div className="important-notes">
                <div className="note-card alert">
                  <AlertCircle className="note-icon" />
                  <div>
                    <h4>Importante</h4>
                    <p>La institución de destino podrá solicitar documentación adicional que será indispensable presentar.</p>
                  </div>
                </div>
                
                <div className="note-card info">
                  <CheckCircle className="note-icon" />
                  <div>
                    <h4>Para estudiantes en movilidad</h4>
                    <p>Al llegar a tu institución destino, acude al área de Relaciones Internacionales para firmar el 
                       <a href="https://uaslpedu-my.sharepoint.com/:b:/g/personal/internacionalizacion_uaslp_mx/ETo6x6534qtNiIXBHZsJFcAB9Ne_K3jsMDSol4_uPxe4tw?e=Of5LC6" target="_blank" rel="noopener noreferrer">
                         Certificado de llegada y salida
                       </a>.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === 'contacts' && (
            <section className="content-section">
              <h2>Contactos y Ubicación</h2>
              
              <div className="office-info">
                <div className="office-card">
                  <MapPin className="office-icon" />
                  <div>
                    <h3>Dirección de Internacionalización</h3>
                    <p>Av. Manuel Nava No.201, 2do. piso</p>
                    <p>Edificio de Finanzas, Zona Universitaria</p>
                    <p>Tel. 52 (444) 826 23 00</p>
                  </div>
                </div>
              </div>

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
                      <p><strong>Área:</strong> {contact.areas}</p>
                      <div className="contact-links">
                        <a href={`mailto:${contact.email}`} className="contact-link">
                          <Mail className="contact-link-icon" />
                          {contact.email}
                        </a>
                        <a href={`tel:${contact.phone.replace(/\s+/g, '')}`} className="contact-link">
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

export default MovilidadPresencial;