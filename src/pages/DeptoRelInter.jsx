import React from 'react';
import './DeptoRelInt.css';

const DeptoRelInter = () => {
  return (
    <div className="depto-container">
      {/* Encabezado institucional */}
      <header className="header">
        <div className="logo">
          <img src="/logo-uaslp.png" alt="UASLP" style={{ height: "50px", width: "auto" }} />
        </div>
        <nav>
          <a href="#facultad">Facultad</a>
          <a href="#programas">Programas</a>
          <a href="#convocatorias">Convocatorias</a>
          <a href="#experiencias">Experiencias</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      {/* Título del departamento */}
      <section className="titulo-depto">
        <h2>Departamento de Relaciones Internacionales</h2>
      </section>

      {/* Misión y visión */}
      <section className="info-depto">
        <p>
          Con la finalidad de mejorar la calidad y las relaciones internacionales e interculturales,
          la UASLP es una institución global que mantiene cursos, colaboración y convenios de cooperación
          con otras instituciones del mundo, en beneficio de sus estudiantes e investigadores.
        </p>

        <h4>Misión</h4>
        <p>
          Fortalecer el proceso de internacionalización de la UASLP en sus funciones sustantivas de docencia,
          investigación y extensión de la cultura, así como contribuir a la formación integral de los estudiantes,
          desarrollando en ellos la capacidad de adaptarse y actuar con eficacia en ambientes multiculturales
          en el ámbito global.
        </p>

        <h4>Visión</h4>
        <p>
          Ser líderes en la internacionalización de la Educación Superior, mediante la sólida formación de estudiantes
          conscientes de su responsabilidad social, aptos para desempeñarse exitosamente en los ámbitos de la docencia,
          la cultura, la tecnología y la investigación con una perspectiva global, de justicia social, equidad,
          sostenibilidad, empatía y contribución al desarrollo regional del País.
        </p>

        <p>
          Además, ofrece a su comunidad universitaria y sociedad el aprendizaje de diversos idiomas, mediante cursos
          y programas. ¡Acércate y conoce más sobre ellos!
        </p>
      </section>

      {/* Sección de oportunidades */}
      <section className="oportunidades">
        <div className="card">
          <div className="card-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#004b87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#004b87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#004b87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h5>Movilidad Estudiantil</h5>
          <p>Oportunidades de intercambio académico con universidades internacionales.</p>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 10V6C22 5.45 21.55 5 21 5H3C2.45 5 2 5.45 2 6V10" stroke="#004b87" strokeWidth="2"/>
              <path d="M7 19H17" stroke="#004b87" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 15V19" stroke="#004b87" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 10C22 13.31 19.31 16 16 16H8C4.69 16 2 13.31 2 10" stroke="#004b87" strokeWidth="2"/>
            </svg>
          </div>
          <h5>Doble Titulación</h5>
          <p>Programas que permiten obtener títulos de dos universidades diferentes.</p>
        </div>
        
        <div className="card">
          <div className="card-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="#004b87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h5>Convocatoria a Becas EIFFEL</h5>
          <p>Prestigiosas becas del gobierno francés para estudios de posgrado en Francia.</p>
        </div>
      </section>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} UASLP - Facultad de Ingeniería. Todos los
          derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default DeptoRelInter;