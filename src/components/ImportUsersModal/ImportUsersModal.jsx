import React, { useState } from "react";
import Papa from "papaparse";
import api from "../../api/axiosConfig";
import "./ImportUsersModal.css";

const ImportUsersModal = ({ onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Preview, 3: Results
  const [importResults, setImportResults] = useState(null);

  // Orden exacto según la estructura de la base de datos
  const REQUIRED_COLUMNS = [
    "nombres",
    "email",
    "password",
  ];

  const OPTIONAL_COLUMNS = [
    "apellido_paterno",
    "apellido_materno",
    "clave",
    "telefono",
    "rol",
    "tipo_movilidad",
    "ciclo_escolar_inicio",
    "ciclo_escolar_final",
    "universidad_id",
    "facultad_id",
    "carrera_id",
    "beca_id",
  ];

  // Estructura del CSV en el orden exacto de la base de datos
  const ALL_COLUMNS = [
    "nombres",
    "apellido_paterno",
    "apellido_materno",
    "clave",
    "telefono",
    "email",
    "password",
    "rol",
    "tipo_movilidad",
    "ciclo_escolar_inicio",
    "ciclo_escolar_final",
    "universidad_id",
    "facultad_id",
    "carrera_id",
    "beca_id",
  ];

  const VALID_ROLES = ["alumno", "becario", "administrador"];
  const VALID_TIPO_MOVILIDAD = [
    "movilidad_internacional",
    "movilidad_virtual",
    "visitante_nacional",
    "visitante_internacional",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Limpiar errores previos
    setErrors([]);
    
    if (!selectedFile) {
      console.log("No se seleccionó archivo");
      setFile(null);
      return;
    }

    console.log("Archivo seleccionado:", {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: new Date(selectedFile.lastModified).toISOString(),
    });
    
    // Validar extensión del archivo
    if (!selectedFile.name.endsWith(".csv")) {
      setErrors(["Por favor, selecciona un archivo CSV válido (extensión .csv)"]);
      setFile(null);
      // Limpiar el input
      e.target.value = null;
      return;
    }
    
    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setErrors(["El archivo es demasiado grande. El tamaño máximo es 5MB"]);
      setFile(null);
      e.target.value = null;
      return;
    }

    console.log(" Archivo válido, estableciendo estado");
    setFile(selectedFile);
  };

  const validateRow = (row, index) => {
    const rowErrors = [];
    const rowNumber = index + 2; // +2 porque index empieza en 0 y hay header

    // Validar campos requeridos (nombres, email, password son obligatorios)
    REQUIRED_COLUMNS.forEach((col) => {
      if (!row[col] || row[col].trim() === "") {
        rowErrors.push(`Fila ${rowNumber}: Falta el campo requerido "${col}"`);
      }
    });

    // Validar email
    if (row.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        rowErrors.push(`Fila ${rowNumber}: Email inválido "${row.email}"`);
      }
    }

    // Validar rol
    if (row.rol && !VALID_ROLES.includes(row.rol)) {
      rowErrors.push(
        `Fila ${rowNumber}: Rol inválido "${row.rol}". Debe ser: ${VALID_ROLES.join(", ")}`
      );
    }

    // Validar tipo_movilidad
    if (row.tipo_movilidad && !VALID_TIPO_MOVILIDAD.includes(row.tipo_movilidad)) {
      rowErrors.push(
        `Fila ${rowNumber}: Tipo de movilidad inválido "${row.tipo_movilidad}"`
      );
    }

    // Validar IDs numéricos
    const numericFields = [
      "universidad_id",
      "facultad_id",
      "carrera_id",
      "beca_id",
    ];
    numericFields.forEach((field) => {
      if (row[field] && row[field] !== "" && isNaN(parseInt(row[field]))) {
        rowErrors.push(
          `Fila ${rowNumber}: "${field}" debe ser un número`
        );
      }
    });

    // Validar teléfono
    if (row.telefono && row.telefono.length > 15) {
      rowErrors.push(
        `Fila ${rowNumber}: Teléfono demasiado largo (máx. 15 caracteres)`
      );
    }

    // Validar clave
    if (row.clave && row.clave.length > 10) {
      rowErrors.push(
        `Fila ${rowNumber}: Clave demasiado larga (máx. 10 caracteres)`
      );
    }

    return rowErrors;
  };

  const handleParseCSV = () => {
    if (!file) {
      setErrors(["Por favor, selecciona un archivo primero"]);
      return;
    }

    setLoading(true);
    setErrors([]);

    // Usar FileReader para mejor compatibilidad y evitar problemas de permisos
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvText = e.target.result;

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          encoding: "UTF-8",
          complete: (results) => {
            try {
              const { data } = results;

              if (data.length === 0) {
                setErrors(["El archivo CSV está vacío"]);
                setLoading(false);
                return;
              }

              // Validar columnas
              const fileColumns = Object.keys(data[0]);
              const missingColumns = REQUIRED_COLUMNS.filter(
                (col) => !fileColumns.includes(col)
              );

              if (missingColumns.length > 0) {
                setErrors([
                  `Faltan las siguientes columnas requeridas: ${missingColumns.join(", ")}`,
                ]);
                setLoading(false);
                return;
              }

              // Validar cada fila
              const allErrors = [];
              data.forEach((row, index) => {
                const rowErrors = validateRow(row, index);
                allErrors.push(...rowErrors);
              });

              if (allErrors.length > 0) {
                setErrors(allErrors);
                setLoading(false);
                return;
              }

              // Procesar datos en el orden exacto de la base de datos
              const processedData = data.map((row) => ({
                nombres: row.nombres.trim(),
                apellido_paterno: row.apellido_paterno?.trim() || null,
                apellido_materno: row.apellido_materno?.trim() || null,
                clave: row.clave?.trim() || null,
                telefono: row.telefono?.trim() || null,
                email: row.email.trim().toLowerCase(),
                password: row.password.trim(),
                rol: row.rol?.trim() || "alumno",
                tipo_movilidad: row.tipo_movilidad?.trim() || null,
                ciclo_escolar_inicio: row.ciclo_escolar_inicio?.trim() || null,
                ciclo_escolar_final: row.ciclo_escolar_final?.trim() || null,
                universidad_id: row.universidad_id ? parseInt(row.universidad_id) : null,
                facultad_id: row.facultad_id ? parseInt(row.facultad_id) : null,
                carrera_id: row.carrera_id ? parseInt(row.carrera_id) : null,
                beca_id: row.beca_id ? parseInt(row.beca_id) : null,
              }));

              setParsedData(processedData);
              setStep(2);
              setLoading(false);
            } catch (parseError) {
              console.error("Error al procesar CSV:", parseError);
              setErrors([`Error al procesar el archivo: ${parseError.message}`]);
              setLoading(false);
            }
          },
          error: (error) => {
            console.error("Error de Papa.parse:", error);
            setErrors([`Error al analizar el CSV: ${error.message}`]);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error al leer el archivo:", error);
        setErrors([`Error al leer el archivo: ${error.message}`]);
        setLoading(false);
      }
    };

    reader.onerror = (error) => {
      console.error("Error de FileReader:", error);
      console.error("FileReader error details:", {
        error: reader.error,
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
      });
      setErrors([
        `No se pudo leer el archivo "${file?.name}". Detalles:`,
        "- Verifica que el archivo no esté abierto en otro programa (Excel, etc.)",
        "- Asegúrate de que el archivo existe y no está corrupto",
        "- Intenta copiar el archivo a otra ubicación",
        `- Tipo de error: ${reader.error?.name || "Desconocido"}`,
      ]);
      setLoading(false);
    };

    reader.onabort = () => {
      console.warn("FileReader aborted");
      setErrors(["La lectura del archivo fue cancelada"]);
      setLoading(false);
    };

    // Leer el archivo como texto
    try {
      console.log("Iniciando lectura de archivo:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString(),
      });
      reader.readAsText(file, "UTF-8");
    } catch (error) {
      console.error("Error al iniciar lectura:", error);
      setErrors([
        "No se pudo leer el archivo. Asegúrate de que el archivo no esté bloqueado o abierto en otro programa.",
      ]);
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setErrors([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");

      console.log("=== Iniciando importación ===");
      console.log("Número de usuarios a importar:", parsedData.length);
      console.log("Datos a enviar:", JSON.stringify(parsedData, null, 2));

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      console.log("Enviando petición POST a /users/import...");
      const response = await api.post(
        "/users/import",
        { users: parsedData },
        config
      );

      console.log("✓ Respuesta recibida:", response.data);
      setImportResults(response.data);
      setStep(3);
      
      // Notificar éxito al componente padre
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error("Error en importación:", error);
      console.error("Error completo:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Manejar diferentes tipos de errores
      let errorMessages = [];
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        // Si el backend devuelve errores específicos de cada usuario
        errorMessages = error.response.data.errors;
      } else if (error.response?.data?.message) {
        // Mensaje de error general del backend
        errorMessages = [error.response.data.message];
      } else if (error.response?.status === 500) {
        errorMessages = [
          "Error interno del servidor. Posibles causas:",
          "• Usuarios con emails o claves que ya existen en el sistema",
          "• Problemas de conexión con la base de datos",
          "• IDs de referencias (universidad, facultad, carrera, beca) que no existen"
        ];
      } else {
        errorMessages = ["Error al importar usuarios. Por favor, intenta de nuevo."];
      }
      
      setErrors(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    // Estructura exacta de la base de datos con usuarios de ejemplo únicos
    const csvContent = [
      ALL_COLUMNS.join(","),
      // Ejemplo 1: Usuario completo con todos los campos - usa emails únicos con timestamp para evitar duplicados
      `Ejemplo1,Usuario,Test,TEST${Date.now()}A,5551111111,ejemplo1.test.${Date.now()}@importacion.com,password123,alumno,movilidad_internacional,2024-2025/I,2024-2025/II,1,1,1,1`,
      // Ejemplo 2: Usuario becario sin apellido_materno ni beca_id
      `Ejemplo2,Usuario,,TEST${Date.now()}B,5552222222,ejemplo2.test.${Date.now()}@importacion.com,securepass456,becario,visitante_nacional,2024-2025/I,2024-2025/II,1,1,1,`,
      // Ejemplo 3: Usuario básico solo con campos requeridos
      `Ejemplo3,Usuario,,,5553333333,ejemplo3.test.${Date.now()}@importacion.com,mypass789,alumno,,,,,,`,
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_usuarios.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderStep1 = () => (
    <div className="import-step">
      <h3>Paso 1: Seleccionar archivo CSV</h3>

      <div className="instructions-box">
        <h4> Instrucciones para el archivo CSV</h4>
        
        <div className="instruction-section">
          <h5>Estructura del CSV (orden de columnas según base de datos):</h5>
          <ol style={{ paddingLeft: '24px', listStyle: 'decimal' }}>
            <li><strong>nombres</strong>  REQUERIDO - Nombre(s) del usuario</li>
            <li><strong>apellido_paterno</strong> - Apellido paterno</li>
            <li><strong>apellido_materno</strong> - Apellido materno</li>
            <li><strong>clave</strong> - Clave única del estudiante (debe ser única)</li>
            <li><strong>telefono</strong> - Número telefónico</li>
            <li><strong>email</strong>  REQUERIDO - Correo electrónico único</li>
            <li><strong>password</strong>  REQUERIDO - Contraseña (será encriptada automáticamente)</li>
            <li><strong>rol</strong> - alumno (predeterminado), becario o administrador</li>
            <li><strong>tipo_movilidad</strong> - movilidad_internacional, movilidad_virtual, visitante_nacional o visitante_internacional</li>
            <li><strong>ciclo_escolar_inicio</strong> - Formato: 2024-2025/I</li>
            <li><strong>ciclo_escolar_final</strong> - Formato: 2024-2025/II</li>
            <li><strong>universidad_id</strong> - ID de la universidad (número entero)</li>
            <li><strong>facultad_id</strong> - ID de la facultad (número entero)</li>
            <li><strong>carrera_id</strong> - ID de la carrera (número entero)</li>
            <li><strong>beca_id</strong> - ID de la beca (número entero)</li>
          </ol>
        </div>

        <div className="instruction-section important">
          <h5> Importante:</h5>
          <ul>
            <li>El archivo debe ser formato CSV (.csv)</li>
            <li>La primera fila debe contener los nombres de las columnas <strong>en este orden exacto</strong></li>
            <li>Los campos requeridos (nombres, email, password) no pueden estar vacíos</li>
            <li><strong>Los emails y claves deben ser ÚNICOS</strong> - no pueden existir ya en el sistema</li>
            <li>Si intentas importar usuarios que ya existen, esos usuarios fallarán pero los demás se importarán</li>
            <li>Los IDs (universidad_id, facultad_id, carrera_id, beca_id) deben existir en el catálogo</li>
            <li>Los campos opcionales pueden dejarse vacíos, pero las comas deben mantenerse</li>
            <li>Puedes descargar una plantilla con ejemplos únicos abajo</li>
          </ul>
        </div>
      </div>

      <button className="template-button" onClick={downloadTemplate}>
         Descargar Plantilla CSV
      </button>

      <div className="file-input-container">
        <label htmlFor="csv-file" className="file-label">
          {file ? file.name : "Seleccionar archivo CSV"}
        </label>
        <input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="file-input"
        />
      </div>

      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn-primary"
          onClick={handleParseCSV}
          disabled={!file || loading}
        >
          {loading ? "Procesando..." : "Siguiente"}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="import-step">
      <h3>Paso 2: Vista previa de usuarios</h3>
      <p className="preview-info">
        Se importarán <strong>{parsedData.length}</strong> usuarios. Revisa la información antes de continuar.
      </p>

      <div className="preview-table-container">
        <table className="preview-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Clave</th>
              <th>Rol</th>
              <th>Tipo Movilidad</th>
            </tr>
          </thead>
          <tbody>
            {parsedData.slice(0, 10).map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  {user.nombres} {user.apellido_paterno} {user.apellido_materno}
                </td>
                <td>{user.email}</td>
                <td>{user.clave || "N/A"}</td>
                <td>{user.rol}</td>
                <td>{user.tipo_movilidad || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {parsedData.length > 10 && (
          <p className="preview-note">
            Mostrando los primeros 10 usuarios de {parsedData.length} totales
          </p>
        )}
      </div>

      <div className="modal-actions">
        <button
          className="btn-secondary"
          onClick={() => {
            setStep(1);
            setParsedData([]);
            setFile(null);
            setErrors([]);
            // Limpiar el input de archivo
            const fileInput = document.getElementById('csv-file');
            if (fileInput) {
              fileInput.value = '';
            }
          }}
        >
          ← Volver
        </button>
        <button
          className="btn-primary"
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? "Importando..." : "Importar Usuarios"}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="import-step">
      <h3> Importación Completada</h3>

      {importResults && (
        <div className="results-summary">
          <div className="result-card success-card">
            <h4>Usuarios Importados Exitosamente</h4>
            <p className="result-count">{importResults.successful || 0}</p>
          </div>

          {importResults.failed > 0 && (
            <div className="result-card error-card">
              <h4>Usuarios con Errores</h4>
              <p className="result-count">{importResults.failed}</p>
              
              {importResults.errors && importResults.errors.length > 0 && (
                <div className="error-details">
                  <h5>Detalles de errores:</h5>
                  <ul>
                    {importResults.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="modal-actions">
        <button className="btn-primary" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content import-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Importar Usuarios desde CSV</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="sr-only">Cerrar</span>
          </button>
        </div>

        <div className="modal-body">
          {errors.length > 0 && (
            <div className="error-container">
              <h4> Se encontraron errores:</h4>
              <ul className="error-list">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <div className="error-help">
                <p><strong> Consejos para resolver errores:</strong></p>
                <ul>
                  <li>Asegúrate de que el archivo CSV no esté abierto en Excel u otro programa</li>
                  <li>Verifica que el archivo esté guardado con codificación UTF-8</li>
                  <li>Intenta cerrar y volver a abrir el archivo antes de subirlo</li>
                  <li>Si el problema persiste, descarga la plantilla y copia tus datos ahí</li>
                </ul>
              </div>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default ImportUsersModal;
