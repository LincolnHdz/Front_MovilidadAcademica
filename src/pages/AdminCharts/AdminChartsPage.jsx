import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
import useVisitorTracking from "../../hooks/useVisitorTracking";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import StatsFilters from "../../components/Filter";
import { INITIAL_FILTERS } from "../../components/filterConstants";
import { generateChartPdf } from "../../components/PdfGenerator";
import "./AdminChartsPage.css";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
  LineElement
);

// Constants
const CHART_TYPES = [
  { key: "bar", label: "Barras", icon: "📊" },
  { key: "pie", label: "Pastel", icon: "🥧" },
  { key: "doughnut", label: "Dona", icon: "🍩" },
  { key: "line", label: "Línea", icon: "📈" },
];

const ACADEMIC_DATASETS = [
  {
    key: "carrera",
    label: "Usuarios por Carrera",
    endpoint: "/stats/users/by-carrera",
    tipo: "users",
    agrupacion: "carrera",
  },
  {
    key: "tipo_movilidad",
    label: "Usuarios por Tipo de Movilidad",
    endpoint: "/stats/users/by-tipo-movilidad",
    tipo: "users",
    agrupacion: "tipo_movilidad",
  },
];

const COLOR_PALETTE = [
  "#004A98", "#1E88E5", "#43A047", "#F4511E", "#8E24AA", "#FDD835",
  "#6D4C41", "#26A69A", "#7E57C2", "#EC407A", "#5C6BC0", "#FF7043",
  "#9CCC65", "#29B6F6", "#AB47BC", "#FFCA28", "#8D6E63", "#00ACC1",
];

// Helper Component
const SummaryCard = ({ number, label }) => (
  <div className="summary-card">
    <div className="summary-number">{number || 0}</div>
    <div className="summary-label">{label}</div>
  </div>
);

// Modal Component
const EmailPdfModal = ({ isOpen, onClose, pdfBlob, onSendEmail }) => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [pdfBlob]);

  const handleSend = async () => {
    if (!email.trim()) {
      setMessage("Por favor ingresa un correo electrónico");
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Por favor ingresa un correo electrónico válido");
      return;
    }

    setSending(true);
    setMessage("");
    
    try {
      await onSendEmail(email, pdfBlob);
      setMessage("✓ Correo enviado exitosamente");
      setTimeout(() => {
        onClose();
        setEmail("");
        setMessage("");
      }, 2000);
    } catch (error) {
      setMessage("✗ Error al enviar el correo: " + (error.message || "Intenta de nuevo"));
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Enviar Gráficas por Correo</h2>
          <button className="modal-close-button" onClick={handleClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {/* Preview del PDF */}
          <div className="pdf-preview-container">
            <h3>Vista Previa del PDF</h3>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="pdf-iframe"
                title="Vista previa del PDF"
              />
            ) : (
              <div className="pdf-loading">Generando vista previa...</div>
            )}
          </div>

          {/* Input de correo */}
          <div className="email-input-container">
            <label htmlFor="email-input">Correo Electrónico:</label>
            <input
              id="email-input"
              type="email"
              className="email-input"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sending}
            />
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div className={`modal-message ${message.includes("✓") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-button cancel" onClick={handleClose} disabled={sending}>
            Cancelar
          </button>
          <button 
            className="modal-button send" 
            onClick={handleSend}
            disabled={sending || !email.trim()}
          >
            {sending ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminChartsPage = () => {
  const { user } = useAuth();
  const chartsRef = useRef(null);

  // Track visitor
  useVisitorTracking("/admin/charts", "admin_charts_view");

  // State
  const [selectedDataset] = useState(ACADEMIC_DATASETS[0]?.key || "carrera");
  const [selectedChartType, setSelectedChartType] = useState(CHART_TYPES[0].key);
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    universidades: [],
    facultades: [],
    carreras: [],
    becas: [],
    tiposMovilidad: [],
    ciclosEscolares: [],
  });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [visitorSummary, setVisitorSummary] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);

  // Memoized values
  const currentDataset = useMemo(
    () => ACADEMIC_DATASETS.find((d) => d.key === selectedDataset),
    [selectedDataset]
  );

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((value) => value !== ""),
    [filters]
  );

  const filteredDataRows = useMemo(() => {
    if (selectedDataset !== 'carrera' || !filterOptions.carreras.length) {
      return dataRows;
    }

    // Si hay filtro de carrera específica
    if (filters.carrera_id) {
      const carreraSeleccionada = filterOptions.carreras.find(
        c => String(c.id) === String(filters.carrera_id) && 
             (!filters.facultad_id || String(c.facultad_id) === String(filters.facultad_id))
      );
      if (carreraSeleccionada) {
        // Filtrar por nombre Y facultad_id
        return dataRows.filter(row => 
          row.label === carreraSeleccionada.nombre && 
          String(row.facultad_id) === String(carreraSeleccionada.facultad_id)
        );
      }
    }

    // Si solo hay filtro de facultad
    if (filters.facultad_id) {
      return dataRows.filter(row => 
        String(row.facultad_id) === String(filters.facultad_id)
      );
    }

    return dataRows;
  }, [dataRows, selectedDataset, filters.facultad_id, filters.carrera_id, filterOptions.carreras]);

  const chartJsData = useMemo(() => {
    const labels = filteredDataRows.map((r) => r.label);
    const values = filteredDataRows.map((r) => Number(r.value || 0));
    const bg = labels.map((_, i) => COLOR_PALETTE[i % COLOR_PALETTE.length]);
    return {
      labels,
      datasets: [
        {
          label: "Alumnos",
          data: values,
          backgroundColor: bg,
          borderColor: bg,
          borderWidth: 1,
        },
      ],
    };
  }, [filteredDataRows]);

  const commonOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "bottom" } },
      layout: { padding: 6 },
      scales:
        selectedChartType === "bar" || selectedChartType === "line"
          ? {
              y: { beginAtZero: true, ticks: { precision: 0 } },
              x: { ticks: { maxRotation: 45, minRotation: 0 } },
            }
          : undefined,
    }),
    [selectedChartType]
  );

  // API Calls
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("No autenticado. Por favor, inicia sesión nuevamente.");
        return;
      }

      if (!currentDataset) {
        setError("No hay dataset seleccionado");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (hasActiveFilters) {
        const params = new URLSearchParams({
          tipo: currentDataset.tipo,
          agrupacion: currentDataset.agrupacion,
          ...filters,
        });
        const res = await api.get(`/stats/filtered?${params}`, config);
        if (!res.data?.success) throw new Error(res.data?.message || "Error");
        setDataRows(res.data.data || []);
      } else {
        const res = await api.get(currentDataset.endpoint, config);
        if (!res.data?.success) throw new Error(res.data?.message || "Error");
        setDataRows(res.data.data || []);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        setError("Token expirado. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
      } else {
        setError(e.response?.data?.message || e.message || "Error de conexión");
      }
    } finally {
      setLoading(false);
    }
  }, [currentDataset, filters, hasActiveFilters]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/stats/filter-options", config);
      
      if (res.data?.success) {
        setFilterOptions(res.data.data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchVisitorSummary = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/stats/visitors/summary", config);
      
      if (res.data?.success) {
        setVisitorSummary(res.data.data);
      }
    } catch {
      // Error silencioso
    }
  }, []);

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchData();
      fetchFilterOptions();
      fetchVisitorSummary();
    }
  }, [user?.rol, currentDataset, filters, fetchData, fetchFilterOptions, fetchVisitorSummary]);

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchFilterOptions();
    }
  }, [user?.rol, fetchFilterOptions]);

  // Handlers
  const clearFilters = () => setFilters(INITIAL_FILTERS);

  const renderChart = () => {
    if (selectedChartType === "pie") return <Pie data={chartJsData} options={commonOptions} />;
    if (selectedChartType === "doughnut") return <Doughnut data={chartJsData} options={commonOptions} />;
    if (selectedChartType === "line") return <Line data={chartJsData} options={commonOptions} />;
    return <Bar data={chartJsData} options={commonOptions} />;
  };

  const handleDownloadPdf = async () => {
    await generateChartPdf(chartsRef, currentDataset, filters, filterOptions, filteredDataRows);
  };

  const handleOpenEmailModal = async () => {
    try {
      // Generar el PDF como blob
      const blob = await generateChartPdf(
        chartsRef, 
        currentDataset, 
        filters, 
        filterOptions, 
        filteredDataRows,
        true // Parámetro para retornar blob en lugar de descargar
      );
      
      setPdfBlob(blob);
      setIsModalOpen(true);
    } catch (error) {
      setError("Error al generar el PDF: " + error.message);
    }
  };

  const handleSendEmail = async (email, pdfBlob) => {
    console.log(pdfBlob)
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No autenticado");
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("pdf", pdfBlob, "graficas.pdf");
    
    // Agregar información adicional si es necesario
    formData.append("dataset", currentDataset.label);
    formData.append("filters", JSON.stringify(filters));

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await api.post("/stats/send-pdf-email", formData, config);
    
    if (!response.data?.success) {
      throw new Error(response.data?.message || "Error al enviar el correo");
    }

    return response.data;
  };

  if (user?.rol !== "administrador") {
    return (
      <div className="access-denied">
        <h2>Acceso denegado</h2>
        <p>Esta sección es solo para administradores.</p>
      </div>
    );
  }

  return (
    <div className="admin-charts-container">
      <div className="admin-page-header">
        <h1 className="admin-title">Gráficas</h1>
        <div className="chart-controls">
          <div className="chart-type-selector">
            <div className="chart-type-buttons">
              {CHART_TYPES.map((t) => (
                <button
                  key={t.key}
                  className={`chart-type-button ${selectedChartType === t.key ? "active" : ""}`}
                  onClick={() => setSelectedChartType(t.key)}
                  title={t.label}
                >
                  <span className="chart-type-icon">{t.icon}</span>
                  <span className="chart-type-text">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            className="refresh-button"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "↻ Actualizar"}
          </button>
          <button className="pdf-button" onClick={handleDownloadPdf}>
            Descargar Gráficas PDF
          </button>
          <button className="pdf-button" onClick={handleOpenEmailModal}>
            ✉ Enviar Gráficas por Correo
          </button>
        </div>
      </div>

      {/* Panel de filtros avanzados: siempre visible */}
      <div className="advanced-filters-panel">
        <div className="filters-header">
          <h3>Filtros Avanzados</h3>
          <button className="clear-filters-button" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        </div>
        
        <StatsFilters
          filters={filters}
          onFilterChange={setFilters}
          filterOptions={filterOptions}
        />
      </div>

      {error && (
        <div className="status-message error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Panel de resumen de visitantes */}
      {visitorSummary && (
        <div className="visitor-summary-panel">
          <h3>Resumen de Actividad (Últimos 30 días)</h3>
          <div className="summary-grid">
            <SummaryCard number={visitorSummary.total_visits} label="Total Visitas" />
            <SummaryCard number={visitorSummary.unique_users} label="Usuarios Únicos" />
            <SummaryCard number={visitorSummary.unique_ips} label="IPs Únicas" />
            <SummaryCard number={visitorSummary.unique_sessions} label="Sesiones Únicas" />
          </div>
        </div>
      )}

      <div ref={chartsRef} className="charts-wrapper">
        <div className="chart-card">{renderChart()}</div>
      </div>

      {/* Tabla de datos bajo la gráfica */}
      <div className="chart-table-wrapper">
        <table className="chart-data-table">
          <thead>
            <tr>
              <th>{currentDataset.label}</th>
              <th>Alumnos</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataRows.map((row) => (
              <tr key={`${currentDataset.key}-${row.id || row.label}`}>
                <td>{row.label}</td>
                <td>{Number(row.value || 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>
                {filteredDataRows.reduce((sum, r) => sum + Number(r.value || 0), 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal para enviar PDF por correo */}
      <EmailPdfModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pdfBlob={pdfBlob}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
};

export default AdminChartsPage;