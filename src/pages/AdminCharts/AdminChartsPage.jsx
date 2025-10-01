import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/useAuth";
import api from "../../api/axiosConfig";
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
  { key: "bar", label: "Barras" },
  { key: "pie", label: "Pastel" },
  { key: "doughnut", label: "Dona" },
  { key: "line", label: "Línea" },
];

const datasets = [
  {
    key: "universidad",
    label: "Por Universidad",
    endpoint: "/stats/users/by-universidad",
  },
  {
    key: "facultad",
    label: "Por Facultad",
    endpoint: "/stats/users/by-facultad",
  },
  { key: "carrera", label: "Por Carrera", endpoint: "/stats/users/by-carrera" },
];

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
  const [selectedDataset, setSelectedDataset] = useState(datasets[0].key);
  const [selectedChartType, setSelectedChartType] = useState(chartTypes[0].key);
  const [dataRows, setDataRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chartsRef = useRef(null);

  const currentDataset = useMemo(
    () => datasets.find((d) => d.key === selectedDataset),
    [selectedDataset]
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No autenticado");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(currentDataset.endpoint, config);
      if (!res.data?.success) throw new Error(res.data?.message || "Error");
      setDataRows(res.data.data || []);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rol === "administrador") {
      fetchData();
    }
  }, [user?.rol, currentDataset]);

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
      pdf.text("Reporte de Gráficas", 30, 30);

      // Agregar la gráfica
      pdf.addImage(
        imgData,
        "PNG",
        30,
        50,
        imgWidth,
        Math.min(imgHeight, pageHeight - 200)
      );

      // Agregar la tabla de datos
      let yPosition = 50 + Math.min(imgHeight, pageHeight - 200) + 20;

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
          <select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            className="chart-select"
            title="Seleccionar agrupación"
          >
            {datasets.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>
          <select
            value={selectedChartType}
            onChange={(e) => setSelectedChartType(e.target.value)}
            className="chart-select"
            title="Seleccionar tipo de gráfica"
          >
            {chartTypes.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
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

      {error && (
        <div className="status-message error-message">
          <strong>Error:</strong> {error}
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
