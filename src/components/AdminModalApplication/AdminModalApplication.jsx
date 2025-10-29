import React from 'react';
import MateriasSlider from '../MateriasSlider';
import './AdminModalApplication.css';

const AdminModalApplication = ({ 
  application, 
  statusForm, 
  onClose, 
  onSubmit, 
  onChange,
  isVisible 
}) => {
  if (!isVisible || !application) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(41, 128, 185, 0.18)', zIndex: 1000, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: 'linear-gradient(120deg, #eaf6fb 80%, #d6eaf8 100%)', borderRadius: 18, boxShadow: '0 6px 32px rgba(44,62,80,0.18)', padding: '2.2rem', width: '90%', maxWidth: 600, border: '1.5px solid #3498db', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ color: '#21618c', marginBottom: 8, fontWeight: 700 }}>Actualizar Estado de Solicitud</h2>
        <h3 style={{ color: '#34495e', marginBottom: 18 }}>{application.nombres} {application.apellido_paterno} {application.apellido_materno}</h3>
        
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div>
              <p><strong style={{ color: '#2980b9' }}>Clave:</strong> {application.user_clave}</p>
              <p><strong style={{ color: '#2980b9' }}>Email:</strong> {application.email}</p>
              <p><strong style={{ color: '#2980b9' }}>Universidad:</strong> {application.universidad}</p>
            </div>
            <div>
              <p><strong style={{ color: '#2980b9' }}>Carrera:</strong> {application.carrera}</p>
              <p><strong style={{ color: '#2980b9' }}>Ciclo:</strong> {
                application.cicloescolarinicio && application.cicloescolarfinal 
                  ? `${application.cicloescolarinicio} - ${application.cicloescolarfinal}`
                  : application.cicloescolar || 'N/A'
              }</p>
              {application.paisdestino && (
                <p><strong style={{ color: '#2980b9' }}>País Destino:</strong> {application.paisdestino}</p>
              )}
            </div>
          </div>
          
          <div>
            <p><strong style={{ color: '#2980b9' }}>Materias de interés:</strong></p>
            <MateriasSlider materias={application.materiasinteres} readOnly={true} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label htmlFor="estado" style={{ color: '#2980b9', fontWeight: 600 }}>Estado:</label>
            <select 
              id="estado"
              name="estado"
              value={statusForm.estado}
              onChange={onChange}
              required
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1.5px solid #85c1e9', marginTop: 4, background: '#fff', color: '#21618c', fontWeight: 500 }}
            >
              <option value="">Seleccionar estado</option>
              <option value="en_revision">En Revisión</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label htmlFor="comentarios" style={{ color: '#2980b9', fontWeight: 600 }}>Comentarios:</label>
            <textarea
              id="comentarios"
              name="comentarios"
              value={statusForm.comentarios}
              onChange={onChange}
              rows={4}
              placeholder="Añade comentarios para el solicitante..."
              style={{ width: '100%', padding: '0.6rem', borderRadius: 8, border: '1.5px solid #85c1e9', marginTop: 4, background: '#fff', color: '#21618c', fontWeight: 500 }}
            ></textarea>
          </div>
          
          <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: 14 }}>
            <button type="button" onClick={onClose} className="cancel-button" style={{ background: '#c62828', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(198,40,40,0.08)' }}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" style={{ background: '#3498db', color: '#fff', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(57,73,171,0.08)' }}>
              Actualizar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModalApplication;