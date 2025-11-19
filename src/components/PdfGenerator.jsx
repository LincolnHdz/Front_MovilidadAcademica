import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generateChartPdf = async (
  chartsRef,
  currentDataset,
  filters,
  filterOptions,
  filteredDataRows,
  returnBlob = false
) => {
  if (!chartsRef.current) {
    alert("No se puede generar el PDF: referencia no encontrada");
    return null;
  }

  try {
    // === CAPTURA DE GRÁFICA ===
    const canvas = await html2canvas(chartsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 60;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // === TÍTULO ===
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Reporte de Estadísticas", pageWidth / 2, 30, { align: "center" });

    let yPos = 60;

    // === FILTROS APLICADOS ===
    const hasActiveFilters = Object.values(filters).some((value) => value !== "");

    pdf.setFont("helvetica", "normal");

    if (hasActiveFilters) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Filtros aplicados:", 30, yPos);
      yPos += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const addFilterText = (label, value) => {
        if (value) {
          pdf.text(`• ${label}: ${value}`, 35, yPos);
          yPos += 12;
        }
      };

      const universidad = filterOptions.universidades.find(
        (u) => String(u.id) === String(filters.universidad_id)
      );
      addFilterText("Universidad", universidad?.nombre);

      const facultad = filterOptions.facultades.find(
        (f) => String(f.id) === String(filters.facultad_id)
      );
      addFilterText("Facultad", facultad?.nombre);

      const carrera = filterOptions.carreras.find(
        (c) =>
          String(c.id) === String(filters.carrera_id) &&
          (!filters.facultad_id ||
            String(c.facultad_id) === String(filters.facultad_id))
      );
      addFilterText("Carrera", carrera?.nombre);

      const beca = filterOptions.becas.find(
        (b) => String(b.id) === String(filters.beca_id)
      );
      addFilterText("Beca", beca?.nombre);

      if (filters.tipo_movilidad) {
        const tipo = filters.tipo_movilidad
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        addFilterText("Tipo de Movilidad", tipo);
      }

      addFilterText("Ciclo Escolar Inicio", filters.ciclo_escolar_inicio);
      addFilterText("Ciclo Escolar Final", filters.ciclo_escolar_final);
      addFilterText("Fecha Inicio", filters.fecha_inicio);
      addFilterText("Fecha Fin", filters.fecha_fin);

      yPos += 10;
    }

    const graphY = hasActiveFilters ? yPos + 10 : 50;

    // === GRÁFICA ===
    pdf.addImage(
      imgData,
      "PNG",
      30,
      graphY,
      imgWidth,
      Math.min(imgHeight, pageHeight - 250)
    );

    // === TABLA INSTITUCIONAL ===
    yPos = graphY + Math.min(imgHeight, pageHeight - 250) + 30;

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.text("Resultados", 30, yPos);
    yPos += 20;

    // Encabezado tabla
    const headers = ["Nombre", "Destino", "Beca", "Clave", "Carrera", "Mes"];
    const colWidths = [140, 80, 60, 50, 70, 60];

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");

    let xPos = 30;
    headers.forEach((h, i) => {
      pdf.text(h, xPos, yPos);
      xPos += colWidths[i];
    });

    yPos += 6;

    pdf.setLineWidth(0.5);
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    filteredDataRows.forEach((row) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = 30;
      }

      const values = [
        row.nombre || row.label || "N/A",
        row.destino || "École Centrale",
        "Beca Eiffel",
        row.clave || "000000",
        row.carrera || "N/A",
        row.mes || "Julio–Julio",
      ];

      let x = 30;

      values.forEach((value, idx) => {
        pdf.text(String(value), x, yPos);
        x += colWidths[idx];
      });

      yPos += 14;
    });

    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 15;

    // TOTAL
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total registros:", 30, yPos);
    pdf.text(String(filteredDataRows.length), 130, yPos);

    // === RETURN O DOWNLOAD ===
    if (returnBlob) {
      const pdfBlob = pdf.output("blob");
      return pdfBlob;
    }

    pdf.save("reporte_estadisticas.pdf");
    return null;
  } catch (error) {
    alert("No se pudo generar el PDF");
    console.error("Error generando PDF:", error);
    return null;
  }
};
