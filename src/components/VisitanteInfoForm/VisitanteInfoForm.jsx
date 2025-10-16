import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/useAuth';
import api from '../../api/axiosConfig';
import CountrySelector from '../CountrySelector/CountrySelector';
import './VisitanteInfoForm.css';

const VisitanteInfoForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pais_origen: '',
    fecha_nacimiento: '',
    preparatoria: '',
    entidad_federativa: '',
    nombre_tutor: '',
    dni_curp: '',
    sexo: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Lista de entidades federativas de México
  const entidadesFederativas = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
    'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
    'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit',
    'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí',
    'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
  ];

  // Verificar si el usuario puede usar este formulario
  const canUseForm = user && ['visitante_nacional', 'visitante_internacional'].includes(user.tipo_movilidad);

  useEffect(() => {
    if (canUseForm) {
      loadExistingInfo();
    }
  }, [canUseForm]);

  // Función de auto-guardado con useCallback
  const autoSave = useCallback(async () => {
    // Validar que al menos los campos requeridos estén llenos
    if (!formData.pais_origen || !formData.fecha_nacimiento || !formData.dni_curp || !formData.sexo) {
      return; // No guardar si faltan campos requeridos
    }

    try {
      setSaving(true);
      setError('');
      
      const response = await api.post('/visitantes-info', formData);
      
      if (response.data.success) {
        setSuccess('✓ Información guardada automáticamente');
        
        // Limpiar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      }
    } catch (error) {
      setError('Error al guardar automáticamente');
      console.error('Error en auto-guardado:', error);
    } finally {
      setSaving(false);
    }
  }, [formData]);

  // Auto-guardado con debounce
  useEffect(() => {
    if (!initialLoad && canUseForm) {
      const timeoutId = setTimeout(() => {
        autoSave();
      }, 2000); // Guardar después de 2 segundos de inactividad

      return () => clearTimeout(timeoutId);
    }
  }, [formData, initialLoad, canUseForm, autoSave]);

  const loadExistingInfo = async () => {
    try {
      setSaving(true);
      const response = await api.get('/visitantes-info/my-info');
      
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setFormData({
          pais_origen: data.pais_origen || '',
          fecha_nacimiento: data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '',
          preparatoria: data.preparatoria || '',
          entidad_federativa: data.entidad_federativa || '',
          nombre_tutor: data.nombre_tutor || '',
          dni_curp: data.dni_curp || '',
          sexo: data.sexo || ''
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error al cargar información:', error);
      }
    } finally {
      setSaving(false);
      setInitialLoad(false); // Marca terminó la carga inicial
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleCountryChange = (country) => {
    setFormData(prev => ({
      ...prev,
      pais_origen: country
    }));
    setError('');
    setSuccess('');
  };

  if (!canUseForm) {
    return null; // No mostrar nada si el usuario no puede usar el formulario
  }

  return (
    <div className="visitante-info-form">
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {saving && <div className="saving-message"> Guardando...</div>}

      <div className="visitante-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pais_origen">País de Origen:</label>
            <CountrySelector
              value={formData.pais_origen}
              onChange={handleCountryChange}
              placeholder="Selecciona tu país de origen"
              showLabel={false}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="preparatoria">Preparatoria de Procedencia:</label>
            <input
              type="text"
              id="preparatoria"
              name="preparatoria"
              value={formData.preparatoria}
              onChange={handleInputChange}
              required
              placeholder="Nombre de la preparatoria"
            />
          </div>

          <div className="form-group">
            <label htmlFor="entidad_federativa">
              {user.tipo_movilidad === 'visitante_nacional' ? 'Entidad Federativa:' : 'Estado/Provincia/Región:'}
            </label>
            {user.tipo_movilidad === 'visitante_nacional' ? (
              <select
                id="entidad_federativa"
                name="entidad_federativa"
                value={formData.entidad_federativa}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar entidad</option>
                {entidadesFederativas.map(entidad => (
                  <option key={entidad} value={entidad}>{entidad}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id="entidad_federativa"
                name="entidad_federativa"
                value={formData.entidad_federativa}
                onChange={handleInputChange}
                placeholder="Ej: California, Ontario, Buenos Aires..."
              />
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre_tutor">Nombre del Tutor:</label>
            <input
              type="text"
              id="nombre_tutor"
              name="nombre_tutor"
              value={formData.nombre_tutor}
              onChange={handleInputChange}
              placeholder="Nombre completo del tutor"
            />
          </div>

          <div className="form-group">
            <label htmlFor="dni_curp">DNI/CURP:</label>
            <input
              type="text"
              id="dni_curp"
              name="dni_curp"
              value={formData.dni_curp}
              onChange={handleInputChange}
              required
              placeholder="Documento de identidad"
              maxLength="50"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sexo">Sexo:</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitanteInfoForm;