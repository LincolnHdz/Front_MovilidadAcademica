import React from 'react';
import './DeptoRelInter.css'; // Asegúrate de crear este archivo para los estilos

const DeptoRelInter = () => {
  return (
    <div className="depto-container">
      {/* Encabezado institucional */}
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
          <img src="/ruta-a-icono-movilidad.png" alt="Movilidad Estudiantil" />
          <h5>Movilidad Estudiantil</h5>
        </div>
        <div className="card">
          <img src="/ruta-a-icono-doble-titulacion.png" alt="Doble Titulación" />
          <h5>Doble Titulación</h5>
        </div>
        <div className="card">
          <img src="/ruta-a-icono-eiffel.png" alt="Becas EIFFEL" />
          <h5>Convocatoria a Becas EIFFEL</h5>
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


