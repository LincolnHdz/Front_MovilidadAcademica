import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Función helper para generar PDF de gráficas con filtros
export const generateChartPdf = async (
  chartsRef, 
  currentDataset, 
  filters, 
  filterOptions, 
  filteredDataRows, 
  returnBlob = false // Nuevo parámetro para retornar blob
) => {
  if (!chartsRef.current) {
    alert("No se puede generar el PDF: referencia no encontrada");
    return null;
  }

  try {
    const canvas = await html2canvas(chartsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 60;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Título
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Reporte de Estadísticas", pageWidth / 2, 30, { align: "center" });

    let yPos = 60;

    // Mostrar filtros aplicados
    const hasActiveFilters = Object.values(filters).some((value) => value !== "");
    if (hasActiveFilters) {
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text("Filtros aplicados:", 30, yPos);
      yPos += 15;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      // Mostrar filtros con nombres legibles
      if (filters.universidad_id) {
        const universidad = filterOptions.universidades.find(u => String(u.id) === String(filters.universidad_id));
        pdf.text(`• Universidad: ${universidad?.nombre || filters.universidad_id}`, 35, yPos);
        yPos += 12;
      }
      if (filters.facultad_id) {
        const facultad = filterOptions.facultades.find(f => String(f.id) === String(filters.facultad_id));
        pdf.text(`• Facultad: ${facultad?.nombre || filters.facultad_id}`, 35, yPos);
        yPos += 12;
      }
      if (filters.carrera_id) {
        const carrera = filterOptions.carreras.find(c => 
          String(c.id) === String(filters.carrera_id) && 
          (!filters.facultad_id || String(c.facultad_id) === String(filters.facultad_id))
        );
        pdf.text(`• Carrera: ${carrera?.nombre || filters.carrera_id}`, 35, yPos);
        yPos += 12;
      }
      if (filters.beca_id) {
        const beca = filterOptions.becas.find(b => String(b.id) === String(filters.beca_id));
        pdf.text(`• Beca: ${beca?.nombre || filters.beca_id}`, 35, yPos);
        yPos += 12;
      }
      if (filters.tipo_movilidad) {
        const tipoFormateado = filters.tipo_movilidad.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        pdf.text(`• Tipo de Movilidad: ${tipoFormateado}`, 35, yPos);
        yPos += 12;
      }
      if (filters.ciclo_escolar_inicio) {
        pdf.text(`• Ciclo Escolar Inicio: ${filters.ciclo_escolar_inicio}`, 35, yPos);
        yPos += 12;
      }
      if (filters.ciclo_escolar_final) {
        pdf.text(`• Ciclo Escolar Final: ${filters.ciclo_escolar_final}`, 35, yPos);
        yPos += 12;
      }
      if (filters.fecha_inicio) {
        pdf.text(`• Fecha Inicio: ${filters.fecha_inicio}`, 35, yPos);
        yPos += 12;
      }
      if (filters.fecha_fin) {
        pdf.text(`• Fecha Fin: ${filters.fecha_fin}`, 35, yPos);
        yPos += 12;
      }
      yPos += 10;
    }

    const graphY = hasActiveFilters ? yPos + 10 : 50;

    // Gráfica
    pdf.addImage(imgData, "PNG", 30, graphY, imgWidth, Math.min(imgHeight, pageHeight - 250));

    // Tabla de datos
    yPos = graphY + Math.min(imgHeight, pageHeight - 250) + 20;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(currentDataset.label, 30, yPos);
    pdf.text("Alumnos", pageWidth - 100, yPos);
    yPos += 20;

    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 10;

    // Datos (usando filteredDataRows para reflejar el filtrado)
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    filteredDataRows.forEach((row) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = 30;
      }
      pdf.text(row.label, 30, yPos);
      pdf.text(Number(row.value || 0).toString(), pageWidth - 100, yPos);
      yPos += 15;
    });

    // Total
    yPos += 5;
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Total", 30, yPos);
    pdf.text(
      filteredDataRows.reduce((sum, r) => sum + Number(r.value || 0), 0).toString(),
      pageWidth - 100,
      yPos
    );

    // Si returnBlob es true, retornar el blob en lugar de descargar
    if (returnBlob) {
      const pdfBlob = pdf.output('blob');
      return pdfBlob;
    }

    // Si no, descargar el PDF normalmente
    pdf.save("graficas.pdf");
    return null;
  } catch (error) {
    alert("No se pudo generar el PDF");
    console.error("Error generando PDF:", error);
    return null;
  }
};