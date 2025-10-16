import React, { useEffect, useMemo, useRef, useState } from "react";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const chartTypes = [
  { key: "bar", label: "Barras", icon: "📊" },
  { key: "pie", label: "Pastel", icon: "🥧" },
  { key: "doughnut", label: "Dona", icon: "🍩" },
  { key: "line", label: "Línea", icon: "📈" },
];

// Gráficas Generales - Actividad y uso de la plataforma
const generalDatasets = [
  {
    key: "aplicaciones_estado",
    label: "Aplicaciones por Estado",
    endpoint: "/stats/applications/by-estado",
    tipo: "applications",
    agrupacion: "estado",
    categoria: "general",
  },
  {
    key: "aplicaciones_ciclo",
    label: "Aplicaciones por Ciclo Escolar",
    endpoint: "/stats/applications/by-ciclo",
    tipo: "applications",
    agrupacion: "ciclo",
    categoria: "general",
  },
  {
    key: "aplicaciones_mes",
    label: "Aplicaciones por Mes",
    endpoint: "/stats/applications/by-month",
    tipo: "applications",
    agrupacion: "mes",
    categoria: "general",
  },
  {
    key: "usuarios_registrados_mes",
    label: "Usuarios Registrados por Mes",
    endpoint: "/stats/users/by-month",
    tipo: "users",
    agrupacion: "mes",
    categoria: "general",
  },
  {
    key: "paginas_visitadas",
    label: "Páginas Más Visitadas",
    endpoint: "/stats/visitors/pages",
    tipo: "visitors",
    agrupacion: "pages",
    categoria: "general",
  },
  {
    key: "visitas_periodo",
    label: "Visitas por Período",
    endpoint: "/stats/visitors/period",
    tipo: "visitors",
    agrupacion: "period",
    categoria: "general",
  },
  {
    key: "visitas_horario",
    label: "Visitas por Hora del Día",
    endpoint: "/stats/visitors/hourly",
    tipo: "visitors",
    agrupacion: "hourly",
    categoria: "general",
  },
];

// Gráficas Académicas - Datos específicos de universidades, facultades, carreras
const academicDatasets = [
  {
    key: "universidad",
    label: "Usuarios por Universidad",
    endpoint: "/stats/users/by-universidad",
    tipo: "users",
    agrupacion: "universidad",
    categoria: "academico",
  },
  {
    key: "carrera",
    label: "Usuarios por Carrera",
    endpoint: "/stats/users/by-carrera",
    tipo: "users",
    agrupacion: "carrera",
    categoria: "academico",
  },
  {
    key: "tipo_movilidad",
    label: "Usuarios por Tipo de Movilidad",
    endpoint: "/stats/users/by-tipo-movilidad",
    tipo: "users",
    agrupacion: "tipo_movilidad",
    categoria: "academico",
  },
];

// Combinar datasets (solo académicos, excluyendo "Usuarios por Universidad")
const datasets = academicDatasets.filter((d) => d.key !== "universidad");

const colorPalette = [
  "#004A98",
  "#1E88E5",
  "#43A047",
  "#F4511E",
  "#8E24AA",
  "#FDD835",
  "#6D4C41",
  "#26A69A",
  "#7E57C2",
  "#EC407A",
  "#5C6BC0",
  "#FF7043",
];

const AdminChartsPage = () => {
  const { user } = useAuth();

  // Track visitor
  useVisitorTracking("/admin/charts", "admin_charts_view");
  const [selectedDataset, setSelectedDataset] = useState(
    datasets[0]?.key || "carrera"
  );
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0].key);
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chartsRef = useRef(null);

  // Estados para filtros avanzados (siempre visible)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    universidades: [],
    facultades: [],
    carreras: [],
    tiposMovilidad: [],
    estadosAplicacion: [],
    ciclosEscolares: [],
  });
  const [filters, setFilters] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    universidad_id: "",
    facultad_id: "",
    carrera_id: "",
    tipo_movilidad: "",
    estado_aplicacion: "",
    ciclo_escolar: "",
  });
  const [visitorSummary, setVisitorSummary] = useState(null);

  const currentDataset = useMemo(
    () => datasets.find((d) => d.key === selectedDataset),
    [selectedDataset]
  );

  // Datasets ya están filtrados para mostrar solo los académicos

  const fetchData = async () => {
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

      // Si hay filtros activos, usar el endpoint filtrado
      const hasActiveFilters = Object.values(filters).some(
        (value) => value !== ""
      );

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
  };

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No hay token para cargar opciones de filtros");
        return;
      }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/stats/filter-options", config);
      if (res.data?.success) {
        setFilterOptions(res.data.data);
      } else {
        console.error("Error en respuesta del servidor:", res.data?.message);
      }
    } catch (e) {
      console.error("Error cargando opciones de filtros:", e);
      if (e.response?.status === 401) {
        console.error("Token expirado al cargar filtros");
        localStorage.removeItem("token");
      }
    }
  };

  const fetchVisitorSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get("/stats/visitors/summary", config);
      if (res.data?.success) {
        setVisitorSummary(res.data.data);
      }
    } catch (e) {
      console.error("Error cargando resumen de visitantes:", e);
    }
  };

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchData();
      fetchFilterOptions();
      fetchVisitorSummary();
    }
  }, [user?.rol, currentDataset, filters]);

  // Cargar opciones de filtros al montar el componente
  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchFilterOptions();
    }
  }, [user?.rol]);

  // Sin selección de categoría; siempre académicos

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      fecha_inicio: "",
      fecha_fin: "",
      universidad_id: "",
      facultad_id: "",
      carrera_id: "",
      tipo_movilidad: "",
      estado_aplicacion: "",
      ciclo_escolar: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  const chartJsData = useMemo(() => {
    const labels = dataRows.map((r) => r.label);
    const values = dataRows.map((r) => Number(r.value || 0));
    const bg = labels.map((_, i) => colorPalette[i % colorPalette.length]);
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
  }, [dataRows]);

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

  const renderChart = () => {
    if (selectedChartType === "pie")
      return <Pie data={chartJsData} options={commonOptions} />;
    if (selectedChartType === "doughnut")
      return <Doughnut data={chartJsData} options={commonOptions} />;
    if (selectedChartType === "line")
      return <Line data={chartJsData} options={commonOptions} />;
    return <Bar data={chartJsData} options={commonOptions} />;
  };

  const handleDownloadPdf = async () => {
    try {
      const container = chartsRef.current;
      if (!container) return;
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 60;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Título del reporte
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Reporte de Gráficas", 30, 30);

      // Información de filtros aplicados
      if (hasActiveFilters) {
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        let yPos = 50;
        pdf.text("Filtros aplicados:", 30, yPos);
        yPos += 10;

        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            const label = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
            pdf.text(`• ${label}: ${value}`, 35, yPos);
            yPos += 8;
          }
        });

        yPos += 10;
      }

      // Calcular posición de la gráfica
      const graphY = hasActiveFilters ? 120 : 50;

      // Agregar la gráfica
      pdf.addImage(
        imgData,
        "PNG",
        30,
        graphY,
        imgWidth,
        Math.min(imgHeight, pageHeight - 250)
      );

      // Agregar la tabla de datos
      let yPosition = graphY + Math.min(imgHeight, pageHeight - 250) + 20;

      // Encabezado de la tabla
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(currentDataset.label, 30, yPosition);
      pdf.text("Alumnos", pageWidth - 100, yPosition);
      yPosition += 20;

      // Línea separadora
      pdf.line(30, yPosition, pageWidth - 30, yPosition);
      yPosition += 10;

      // Filas de datos
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      dataRows.forEach((row) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 30;
        }
        pdf.text(row.label, 30, yPosition);
        pdf.text(Number(row.value || 0).toString(), pageWidth - 100, yPosition);
        yPosition += 15;
      });

      // Línea separadora antes del total
      yPosition += 5;
      pdf.line(30, yPosition, pageWidth - 30, yPosition);
      yPosition += 10;

      // Fila de total
      pdf.setFont("helvetica", "bold");
      pdf.text("Total", 30, yPosition);
      pdf.text(
        dataRows.reduce((sum, r) => sum + Number(r.value || 0), 0).toString(),
        pageWidth - 100,
        yPosition
      );

      pdf.save("graficas.pdf");
    } catch (e) {
      console.error("Error exportando PDF", e);
      alert("No se pudo generar el PDF");
    }
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
              {chartTypes.map((t) => (
                <button
                  key={t.key}
                  className={`chart-type-button ${
                    selectedChartType === t.key ? "active" : ""
                  }`}
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
        <div className="filters-grid">
          <div className="filter-group">
            <label>Universidad:</label>
            <select
              value={filters.universidad_id}
              onChange={(e) =>
                handleFilterChange("universidad_id", e.target.value)
              }
              className="filter-select"
            >
              <option value="">Todas</option>
              {filterOptions.universidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Facultad:</label>
            <select
              value={filters.facultad_id}
              onChange={(e) =>
                handleFilterChange("facultad_id", e.target.value)
              }
              className="filter-select"
            >
              <option value="">Todas</option>
              {filterOptions.facultades.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Carrera:</label>
            <select
              value={filters.carrera_id}
              onChange={(e) => handleFilterChange("carrera_id", e.target.value)}
              className="filter-select"
            >
              <option value="">Todas</option>
              {filterOptions.carreras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Tipo de Movilidad:</label>
            <select
              value={filters.tipo_movilidad}
              onChange={(e) =>
                handleFilterChange("tipo_movilidad", e.target.value)
              }
              className="filter-select"
            >
              <option value="">Todos</option>
              {filterOptions.tiposMovilidad.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Estado de Aplicación:</label>
            <select
              value={filters.estado_aplicacion}
              onChange={(e) =>
                handleFilterChange("estado_aplicacion", e.target.value)
              }
              className="filter-select"
            >
              <option value="">Todos</option>
              {filterOptions.estadosAplicacion.map((estado) => (
                <option key={estado} value={estado}>
                  {estado.charAt(0).toUpperCase() + estado.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Ciclo Escolar:</label>
            <select
              value={filters.ciclo_escolar}
              onChange={(e) =>
                handleFilterChange("ciclo_escolar", e.target.value)
              }
              className="filter-select"
            >
              <option value="">Todos</option>
              {filterOptions.ciclosEscolares.map((ciclo) => (
                <option key={ciclo} value={ciclo}>
                  {ciclo}
                </option>
              ))}
            </select>
          </div>
        </div>
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
            <div className="summary-card">
              <div className="summary-number">
                {visitorSummary.total_visits || 0}
              </div>
              <div className="summary-label">Total Visitas</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">
                {visitorSummary.unique_users || 0}
              </div>
              <div className="summary-label">Usuarios Únicos</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">
                {visitorSummary.unique_ips || 0}
              </div>
              <div className="summary-label">IPs Únicas</div>
            </div>
            <div className="summary-card">
              <div className="summary-number">
                {visitorSummary.unique_sessions || 0}
              </div>
              <div className="summary-label">Sesiones Únicas</div>
            </div>
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
            {dataRows.map((row) => (
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
                {dataRows.reduce((sum, r) => sum + Number(r.value || 0), 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminChartsPage;
