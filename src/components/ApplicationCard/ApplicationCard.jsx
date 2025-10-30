import React from 'react';
import MateriasSlider from '../MateriasSlider';
import './ApplicationCard.css';

const ApplicationCard = ({ 
  application, 
  onClick, 
  onApplicationClick,
  showStatus = false,
  showTitle = false,
  title = ""
}) => {
  const app = application;
  
  // Usar onApplicationClick si está disponible, sino usar onClick
  const handleClick = onApplicationClick || onClick;

  // Parsear las materias de interés si es necesario
  let materias = app.materiasinteres;
  if (materias && typeof materias === 'string') {
    try {
      materias = JSON.parse(materias);
    } catch (error) {
      console.error('Error al parsear materias:', error);
      materias = [];
    }
  }

  // Parsear el archivo si es necesario
  let archivo = app.archivo;
  if (archivo && typeof archivo === 'string') {
    try {
      archivo = JSON.parse(archivo);
    } catch { 
      archivo = null; 
    }
  }

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aceptada': return '#2e7d32';
      case 'rechazada': return '#c62828';
      case 'en_revision': return '#f57c00';
      default: return '#3498db';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'aceptada': return 'Aceptada';
      case 'rechazada': return 'Rechazada';
      case 'en_revision': return 'En Revisión';
      default: return estado || 'Pendiente';
    }
  };

  return (
    <div>
      {showTitle && title && (
        <h3 style={{ 
          color: '#21618c', 
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          {title}
        </h3>
      )}
      <div
        className={`application-card ${app.estado}`}
        onClick={handleClick ? () => handleClick(app) : undefined}
        style={{
          borderLeft: `8px solid ${getStatusColor(app.estado)}`,
          cursor: handleClick ? 'pointer' : 'default',
        }}
      >
      {/* Badge de estado */}
      {showStatus && (
        <div style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: '1rem',
          zIndex: 10
        }}>
          <span 
            className={`status-badge ${app.estado}`} 
            style={{ 
              fontWeight: 700, 
              fontSize: '0.75rem', 
              borderRadius: 12, 
              padding: '0.4rem 0.8rem', 
              background: getStatusColor(app.estado), 
              color: '#fff', 
              boxShadow: '0 2px 8px rgba(44,62,80,0.15)',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {getStatusText(app.estado)}
          </span>
        </div>
      )}
      
      <div style={{ flex: 1, position: 'relative' }}>
        <div className="application-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          marginRight: showStatus ? '120px' : '0',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            color: '#21618c', 
            margin: 0, 
            fontWeight: 700, 
            letterSpacing: 0.5,
            lineHeight: '1.3'
          }}>
            {app.nombres || app.nombre} {app.apellido_paterno || app.apellidopaterno} {app.apellido_materno || app.apellidomaterno}
          </h3>
        </div>
        
        <div className="application-info" style={{ color: '#34495e', fontSize: '1.05rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 2rem', marginBottom: '1rem' }}>
            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
              <p style={{ margin: '0.3rem 0' }}>
                <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Clave:</strong> 
                <span style={{ color: '#273746', fontWeight: 600 }}>
                  {app.user_clave || app.clave}
                </span>
              </p>
              {(app.email || app.user_email) && (
                <p style={{ margin: '0.3rem 0' }}>
                  <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Email:</strong> 
                  <span style={{ color: '#273746' }}>{app.email || app.user_email}</span>
                </p>
              )}
              <p style={{ margin: '0.3rem 0' }}>
                <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>Destino:</strong> 
                <span style={{ color: '#273746' }}>{app.universidad}</span>
              </p>

              {app.paisdestino && (
                <p style={{ margin: '0.3rem 0' }}>
                  <strong style={{ color: '#2980b9', display: 'inline-block', width: '90px' }}>País:</strong> 
                  <span style={{ color: '#273746' }}>{app.paisdestino}</span>
                </p>
              )}
            </div>
            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
              <p style={{ margin: '0.3rem 0' }}>
                <strong style={{ color: '#2980b9', display: 'inline-block', width: '120px' }}>Carrera:</strong> 
                <span style={{ color: '#273746' }}>{app.carrera}</span>
              </p>
              <p style={{ margin: '0.3rem 0' }}>
                <strong style={{ color: '#2980b9', display: 'inline-block', width: '120px' }}>Ciclo Escolar:</strong> 
                <span style={{ color: '#273746' }}>
                  {app.cicloescolarinicio && app.cicloescolarfinal 
                    ? `${app.cicloescolarinicio} - ${app.cicloescolarfinal}`
                    : app.cicloescolar || 'N/A'
                  }
                </span>
              </p>
            </div>
          </div>

          {/* Materias de interés */}
          {materias && materias.length > 0 && (
            <div style={{ marginTop: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <strong style={{ color: '#2980b9', whiteSpace: 'nowrap' }}>Materias:</strong> 
              <div style={{ flex: 1, maxHeight: '38px', overflow: 'hidden' }}>
                <MateriasSlider materias={materias} readOnly={true} compactMode={true} />
              </div>
            </div>
          )}
          
          {/* Mostrar enlace al archivo subido si existe */}
          {archivo && archivo.filename && (
            <div style={{ margin: '0.7rem 0' }}>
              <a
                href={`http://localhost:3000/uploads/${archivo.filename}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block',
                  color: '#fff', 
                  background: '#004A98',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  textDecoration: 'none', 
                  fontWeight: 600, 
                  fontSize: '0.95rem',
                  marginTop: '0.5rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}
                onClick={e => e.stopPropagation()}
              >
                Ver/Descargar archivo
              </a>
            </div>
          )}
        </div>
        
        {app.comentarios && (
          <div className="application-comments" style={{ 
            background: '#f8f9fa', 
            borderRadius: 8, 
            padding: '0.7rem 1.2rem', 
            marginTop: '0.7rem', 
            color: '#7f8c8d', 
            borderLeft: '4px solid #3498db' 
          }}>
            <p style={{ margin: 0 }}>
              <strong>Comentarios:</strong> {app.comentarios}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default ApplicationCard;