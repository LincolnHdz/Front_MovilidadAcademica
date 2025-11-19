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
      Math.min(imgHeight, pageHeight - 200)
    );

    // === TABLA DE DATOS ===
    yPos = graphY + Math.min(imgHeight, pageHeight - 200) + 20;
    
    if (yPos > pageHeight - 120) {
      pdf.addPage();
      yPos = 50;
    }

    // Encabezado de la tabla
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Resultados Detallados", 30, yPos);
    yPos += 15;

    // Dibujar tabla
    const colWidth1 = pageWidth - 160;
    const colWidth2 = 70;
    
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text(currentDataset.label, 40, yPos + 5);
    pdf.text("Alumnos", 30 + colWidth1 + 15, yPos + 5);
    yPos += 20;

    // Datos de la tabla
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    
    filteredDataRows.forEach((row, index) => {
      if (yPos > pageHeight - 40) {
        pdf.addPage();
        yPos = 50;
      }

      pdf.text(String(row.label).substring(0, 60), 40, yPos + 3);
      pdf.text(String(row.value || 0), 30 + colWidth1 + 30, yPos + 3, { align: "center" });
      yPos += 15;
    });

    // Línea final
    pdf.setLineWidth(1);
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 15;

    // TOTAL
    const totalAlumnos = filteredDataRows.reduce((sum, r) => sum + Number(r.value || 0), 0);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total de Alumnos:", 40, yPos + 7);
    pdf.setFontSize(14);
    pdf.text(String(totalAlumnos), pageWidth - 50, yPos + 7, { align: "right" });

    // === RETURN O DOWNLOAD ===
    if (returnBlob) {
      const pdfBlob = pdf.output("blob");
      return pdfBlob;
    }

    pdf.save("graficas_estadisticas.pdf");
    return null;
  } catch (error) {
    alert("No se pudo generar el PDF");
    console.error("Error generando PDF:", error);
    return null;
  }
};

// === REPORTE DETALLADO BASADO EN FILTROS ===
export const generateDetailedReportPdf = async (
  reportData,
  tipoMovilidad,
  filters,
  filterOptions,
  returnBlob = false
) => {
  try {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Determinar el tipo de reporte basado en tipo_movilidad
    const isVisitante = tipoMovilidad === "visitante_nacional" || tipoMovilidad === "visitante_internacional";
    const isMovilidad = tipoMovilidad === "movilidad_internacional" || tipoMovilidad === "movilidad_virtual";

    // === TÍTULO ===
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    let titulo = "Reporte Detallado de Usuarios";
    if (tipoMovilidad === "movilidad_internacional") titulo = "Reporte de Movilidad Internacional";
    else if (tipoMovilidad === "movilidad_virtual") titulo = "Reporte de Movilidad Virtual";
    else if (tipoMovilidad === "visitante_nacional") titulo = "Reporte de Visitantes Nacionales";
    else if (tipoMovilidad === "visitante_internacional") titulo = "Reporte de Visitantes Internacionales";
    
    pdf.text(titulo, pageWidth / 2, 40, { align: "center" });

    let yPos = 70;

    // === FILTROS APLICADOS ===
    const hasActiveFilters = Object.values(filters).some((value) => value !== "");
    
    if (hasActiveFilters) {
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text("Filtros aplicados:", 30, yPos);
      yPos += 15;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");

      const addFilterText = (label, value) => {
        if (value) {
          pdf.text(`• ${label}: ${value}`, 35, yPos);
          yPos += 11;
        }
      };

      if (filters.universidad_id) {
        const universidad = filterOptions.universidades?.find(u => String(u.id) === String(filters.universidad_id));
        addFilterText("Universidad", universidad?.nombre);
      }

      if (filters.facultad_id) {
        const facultad = filterOptions.facultades?.find(f => String(f.id) === String(filters.facultad_id));
        addFilterText("Facultad", facultad?.nombre);
      }

      if (filters.carrera_id) {
        const carrera = filterOptions.carreras?.find(c => String(c.id) === String(filters.carrera_id));
        addFilterText("Carrera", carrera?.nombre);
      }

      if (filters.beca_id) {
        const beca = filterOptions.becas?.find(b => String(b.id) === String(filters.beca_id));
        addFilterText("Beca", beca?.nombre);
      }

      addFilterText("Ciclo Escolar Inicio", filters.ciclo_escolar_inicio);
      addFilterText("Ciclo Escolar Final", filters.ciclo_escolar_final);
      addFilterText("Fecha Inicio", filters.fecha_inicio);
      addFilterText("Fecha Fin", filters.fecha_fin);

      yPos += 10;
    }

    // === GENERAR REPORTE SEGÚN TIPO ===
    if (isVisitante) {
      // REPORTE DE VISITANTES (formato tarjeta)
      pdf.setFontSize(9);

      reportData.forEach((visitante) => {
        if (yPos > pageHeight - 200) {
          pdf.addPage();
          yPos = 30;
        }

        const cardHeight = 160;
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(1);
        pdf.rect(30, yPos, pageWidth - 60, cardHeight);

        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(1.5);
        pdf.rect(30, yPos, pageWidth - 60, 25);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        const nombreCompleto = `${visitante.nombres || ""} ${visitante.apellido_paterno || ""} ${visitante.apellido_materno || ""}`.trim();
        pdf.text(nombreCompleto, 40, yPos + 17);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        let cardY = yPos + 40;
        const leftCol = 40;
        const rightCol = pageWidth / 2 + 10;

        pdf.setFont("helvetica", "bold");
        pdf.text("País de Origen:", leftCol, cardY);
        pdf.setFont("helvetica", "normal");
        pdf.text(visitante.pais_origen || "N/A", leftCol + 85, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Carrera:", leftCol, cardY);
        pdf.setFont("helvetica", "normal");
        const carrera = visitante.carrera || "N/A";
        pdf.text(carrera.substring(0, 30), leftCol + 85, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Ciclo Escolar:", leftCol, cardY);
        pdf.setFont("helvetica", "normal");
        const ciclo = `${visitante.ciclo_escolar_inicio || "N/A"} - ${visitante.ciclo_escolar_final || "N/A"}`;
        pdf.text(ciclo.substring(0, 25), leftCol + 85, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Fecha Nacimiento:", leftCol, cardY);
        pdf.setFont("helvetica", "normal");
        const fechaNac = visitante.fecha_nacimiento 
          ? new Date(visitante.fecha_nacimiento).toLocaleDateString()
          : "N/A";
        pdf.text(fechaNac, leftCol + 85, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Sexo:", leftCol, cardY);
        pdf.setFont("helvetica", "normal");
        pdf.text(visitante.sexo || "N/A", leftCol + 85, cardY);

        cardY = yPos + 40;

        pdf.setFont("helvetica", "bold");
        pdf.text("Preparatoria:", rightCol, cardY);
        pdf.setFont("helvetica", "normal");
        const prep = visitante.preparatoria || "N/A";
        pdf.text(prep.substring(0, 22), rightCol + 65, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Entidad:", rightCol, cardY);
        pdf.setFont("helvetica", "normal");
        const entidad = visitante.entidad_federativa || "N/A";
        pdf.text(entidad.substring(0, 22), rightCol + 65, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("Tutor:", rightCol, cardY);
        pdf.setFont("helvetica", "normal");
        const tutor = visitante.nombre_tutor || "N/A";
        pdf.text(tutor.substring(0, 22), rightCol + 65, cardY);
        cardY += 15;

        pdf.setFont("helvetica", "bold");
        pdf.text("DNI/CURP:", rightCol, cardY);
        pdf.setFont("helvetica", "normal");
        const dni = visitante.dni_curp || "N/A";
        pdf.text(dni.substring(0, 18), rightCol + 65, cardY);

        cardY = yPos + cardHeight - 40;
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8.5);
        pdf.text("Materias:", leftCol, cardY);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(7.5);
        
        let materiasField = visitante.materiasinteres || visitante.materiasInteres;
        
        // Si viene como string JSON de PostgreSQL, parsearlo
        if (typeof materiasField === 'string') {
          try {
            materiasField = JSON.parse(materiasField);
          } catch (e) {
            console.error("Error parsing materias:", e);
          }
        }
        
        if (materiasField && Array.isArray(materiasField) && materiasField.length > 0) {
          // Extraer solo los nombres de las materias
          const nombresMaterias = materiasField.map(m => m.nombre || m).filter(Boolean);
          
          if (nombresMaterias && nombresMaterias.length > 0) {
            const materias = nombresMaterias.join(", ");
            const maxWidth = pageWidth - 100;
            const lines = pdf.splitTextToSize(materias, maxWidth);
            pdf.text(lines.slice(0, 3), leftCol, cardY + 10);
          } else {
            pdf.text("Sin materias registradas", leftCol, cardY + 10);
          }
        } else {
          pdf.text("Sin materias registradas", leftCol, cardY + 10);
        }

        yPos += cardHeight + 12;
        pdf.setFontSize(9);
      });

    } else if (isMovilidad) {
      // REPORTE DE MOVILIDAD (formato tabla expandida)
      reportData.forEach((item) => {
        if (yPos > pageHeight - 140) {
          pdf.addPage();
          yPos = 30;
        }

        // Contenedor de la entrada
        const entryHeight = 140;
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(1);
        pdf.rect(30, yPos, pageWidth - 60, entryHeight);

        // Nombre en encabezado
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(1.5);
        pdf.rect(30, yPos, pageWidth - 60, 20);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        const nombreCompleto = `${item.nombres || ""} ${item.apellido_paterno || ""} ${item.apellido_materno || ""}`.trim();
        pdf.text(nombreCompleto, 40, yPos + 14);

        let entryY = yPos + 30;
        const leftCol = 40;
        const rightCol = pageWidth / 2 + 10;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);

        // Columna izquierda
        pdf.setFont("helvetica", "bold");
        pdf.text("Universidad:", leftCol, entryY);
        pdf.setFont("helvetica", "normal");
        const universidad = item.universidad || "N/A";
        const uniLines = pdf.splitTextToSize(universidad, 150);
        pdf.text(uniLines[0], leftCol + 70, entryY);
        entryY += 14;

        pdf.setFont("helvetica", "bold");
        pdf.text("País Destino:", leftCol, entryY);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.paisdestino || "N/A", leftCol + 70, entryY);
        entryY += 14;

        pdf.setFont("helvetica", "bold");
        pdf.text("Carrera:", leftCol, entryY);
        pdf.setFont("helvetica", "normal");
        const carrera = item.carrera || "N/A";
        const carreraLines = pdf.splitTextToSize(carrera, 150);
        pdf.text(carreraLines[0], leftCol + 70, entryY);
        if (carreraLines[1]) {
          entryY += 10;
          pdf.text(carreraLines[1], leftCol + 70, entryY);
        }
        entryY += 14;

        pdf.setFont("helvetica", "bold");
        pdf.text("Beca:", leftCol, entryY);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.beca || "Sin beca", leftCol + 70, entryY);

        // Columna derecha
        entryY = yPos + 30;

        pdf.setFont("helvetica", "bold");
        pdf.text("Clave:", rightCol, entryY);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.clave || "N/A", rightCol + 45, entryY);
        entryY += 14;

        pdf.setFont("helvetica", "bold");
        pdf.text("Ciclo Escolar:", rightCol, entryY);
        pdf.setFont("helvetica", "normal");
        const ciclo = `${item.ciclo_escolar_inicio || "N/A"} - ${item.ciclo_escolar_final || "N/A"}`;
        pdf.text(ciclo, rightCol + 75, entryY);

        // Materias en la parte inferior
        entryY = yPos + entryHeight - 35;
        pdf.setFont("helvetica", "bold");
        pdf.text("Materias:", leftCol, entryY);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(8);
        
        let materiasField = item.materiasinteres || item.materiasInteres;
        
        // Si viene como string JSON de PostgreSQL, parsearlo
        if (typeof materiasField === 'string') {
          try {
            materiasField = JSON.parse(materiasField);
          } catch (e) {
            console.error("Error parsing materias:", e);
          }
        }
        
        if (materiasField && Array.isArray(materiasField) && materiasField.length > 0) {
          // Extraer solo los nombres de las materias
          const nombresMaterias = materiasField.map(m => m.nombre || m).filter(Boolean);
          
          if (nombresMaterias && nombresMaterias.length > 0) {
            const materias = nombresMaterias.join(", ");
            const maxWidth = pageWidth - 100;
            const lines = pdf.splitTextToSize(materias, maxWidth);
            pdf.text(lines.slice(0, 2), leftCol, entryY + 10);
          } else {
            pdf.text("Sin materias registradas", leftCol, entryY + 10);
          }
        } else {
          pdf.text("Sin materias registradas", leftCol, entryY + 10);
        }

        yPos += entryHeight + 10;
        pdf.setFontSize(9);
      });
    }

    // === TOTAL ===
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 30;
    }

    yPos += 15;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total registros:", 30, yPos);
    pdf.text(String(reportData.length), 130, yPos);

    // === RETURN O DOWNLOAD ===
    if (returnBlob) {
      return pdf.output("blob");
    }

    pdf.save(`reporte_detallado_${tipoMovilidad}.pdf`);
    return null;
  } catch (error) {
    alert("No se pudo generar el reporte detallado");
    console.error("Error generando reporte:", error);
    return null;
  }
};

// === REPORTE DE MOVILIDAD INTERNACIONAL Y VIRTUAL ===
export const generateMovilidadReportPdf = async (
  movilidadData,
  tipoMovilidad = "movilidad_internacional",
  returnBlob = false
) => {
  try {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // === TÍTULO ===
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    const titulo = tipoMovilidad === "movilidad_internacional" 
      ? "Reporte de Movilidad Internacional"
      : "Reporte de Movilidad Virtual";
    pdf.text(titulo, pageWidth / 2, 40, { align: "center" });

    let yPos = 70;

    // === ENCABEZADO DE TABLA ===
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    
    const headers = ["Nombre", "Universidad Destino", "País", "Clave", "Carrera", "Ciclo"];
    const colWidths = [100, 80, 60, 50, 80, 70];
    
    let xPos = 30;
    headers.forEach((h, i) => {
      pdf.text(h, xPos, yPos);
      xPos += colWidths[i];
    });

    yPos += 6;
    pdf.setLineWidth(0.5);
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 10;

    // === DATOS ===
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    movilidadData.forEach((item) => {
      // Verificar si necesitamos nueva página
      if (yPos > pageHeight - 100) {
        pdf.addPage();
        yPos = 30;
        
        // Repetir encabezados
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        xPos = 30;
        headers.forEach((h, i) => {
          pdf.text(h, xPos, yPos);
          xPos += colWidths[i];
        });
        yPos += 6;
        pdf.line(30, yPos, pageWidth - 30, yPos);
        yPos += 10;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
      }

      const nombreCompleto = `${item.nombres || ""} ${item.apellido_paterno || ""} ${item.apellido_materno || ""}`.trim();
      const universidad = item.universidad || "N/A";
      const pais = item.paisdestino || "N/A";
      const clave = item.clave || "N/A";
      const carrera = item.carrera || "N/A";
      const ciclo = `${item.ciclo_escolar_inicio || "N/A"} - ${item.ciclo_escolar_final || "N/A"}`;

      // Fila de datos básicos
      xPos = 30;
      pdf.text(nombreCompleto.substring(0, 25), xPos, yPos);
      xPos += colWidths[0];
      pdf.text(universidad.substring(0, 20), xPos, yPos);
      xPos += colWidths[1];
      pdf.text(pais.substring(0, 15), xPos, yPos);
      xPos += colWidths[2];
      pdf.text(clave.substring(0, 12), xPos, yPos);
      xPos += colWidths[3];
      pdf.text(carrera.substring(0, 20), xPos, yPos);
      xPos += colWidths[4];
      pdf.text(ciclo.substring(0, 18), xPos, yPos);

      yPos += 12;

      // Materias (si existen)
      if (item.materiasInteres && item.materiasInteres.length > 0) {
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "italic");
        const materias = Array.isArray(item.materiasInteres) 
          ? item.materiasInteres.join(", ") 
          : String(item.materiasInteres);
        const materiasText = `   Materias: ${materias.substring(0, 100)}${materias.length > 100 ? "..." : ""}`;
        pdf.text(materiasText, 35, yPos);
        yPos += 10;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
      } else {
        yPos += 2;
      }
    });

    yPos += 10;
    pdf.line(30, yPos, pageWidth - 30, yPos);
    yPos += 15;

    // TOTAL
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total registros:", 30, yPos);
    pdf.text(String(movilidadData.length), 130, yPos);

    // === RETURN O DOWNLOAD ===
    if (returnBlob) {
      return pdf.output("blob");
    }

    const filename = tipoMovilidad === "movilidad_internacional" 
      ? "reporte_movilidad_internacional.pdf"
      : "reporte_movilidad_virtual.pdf";
    pdf.save(filename);
    return null;
  } catch (error) {
    alert("No se pudo generar el PDF de movilidad");
    console.error("Error generando PDF:", error);
    return null;
  }
};

// === REPORTE DE VISITANTES NACIONALES E INTERNACIONALES ===
export const generateVisitantesReportPdf = async (
  visitantesData,
  tipoVisitante = "visitante_nacional",
  returnBlob = false
) => {
  try {
    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // === TÍTULO ===
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    const titulo = tipoVisitante === "visitante_nacional" 
      ? "Reporte de Visitantes Nacionales"
      : "Reporte de Visitantes Internacionales";
    pdf.text(titulo, pageWidth / 2, 40, { align: "center" });

    let yPos = 70;

    // === ITERAR POR CADA VISITANTE (tarjeta) ===
    pdf.setFontSize(9);

    visitantesData.forEach((visitante, index) => {
      // Verificar espacio para nueva tarjeta
      if (yPos > pageHeight - 200) {
        pdf.addPage();
        yPos = 30;
      }

      // Marco de la tarjeta
      const cardHeight = 180;
      pdf.setDrawColor(0, 74, 152);
      pdf.setLineWidth(1);
      pdf.rect(30, yPos, pageWidth - 60, cardHeight);

      // Fondo del encabezado
      pdf.setFillColor(0, 74, 152);
      pdf.rect(30, yPos, pageWidth - 60, 25, "F");

      // Nombre completo en encabezado
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      const nombreCompleto = `${visitante.nombres || ""} ${visitante.apellido_paterno || ""} ${visitante.apellido_materno || ""}`.trim();
      pdf.text(nombreCompleto, 40, yPos + 17);

      // Restaurar color de texto
      pdf.setTextColor(0, 0, 0);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);

      let cardY = yPos + 40;
      const leftCol = 40;
      const rightCol = pageWidth / 2 + 10;

      // === COLUMNA IZQUIERDA ===
      pdf.setFont("helvetica", "bold");
      pdf.text("País de Origen:", leftCol, cardY);
      pdf.setFont("helvetica", "normal");
      pdf.text(visitante.pais_origen || "N/A", leftCol + 85, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Carrera:", leftCol, cardY);
      pdf.setFont("helvetica", "normal");
      const carrera = visitante.carrera || "N/A";
      pdf.text(carrera.substring(0, 30), leftCol + 85, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Ciclo Escolar:", leftCol, cardY);
      pdf.setFont("helvetica", "normal");
      const ciclo = `${visitante.ciclo_escolar_inicio || "N/A"} - ${visitante.ciclo_escolar_final || "N/A"}`;
      pdf.text(ciclo.substring(0, 25), leftCol + 85, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Fecha Nacimiento:", leftCol, cardY);
      pdf.setFont("helvetica", "normal");
      const fechaNac = visitante.fecha_nacimiento 
        ? new Date(visitante.fecha_nacimiento).toLocaleDateString()
        : "N/A";
      pdf.text(fechaNac, leftCol + 85, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Sexo:", leftCol, cardY);
      pdf.setFont("helvetica", "normal");
      pdf.text(visitante.sexo || "N/A", leftCol + 85, cardY);

      // === COLUMNA DERECHA ===
      cardY = yPos + 40;

      pdf.setFont("helvetica", "bold");
      pdf.text("Preparatoria:", rightCol, cardY);
      pdf.setFont("helvetica", "normal");
      const prep = visitante.preparatoria || "N/A";
      pdf.text(prep.substring(0, 25), rightCol + 70, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Entidad:", rightCol, cardY);
      pdf.setFont("helvetica", "normal");
      pdf.text(visitante.entidad_federativa || "N/A", rightCol + 70, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("Tutor:", rightCol, cardY);
      pdf.setFont("helvetica", "normal");
      const tutor = visitante.nombre_tutor || "N/A";
      pdf.text(tutor.substring(0, 25), rightCol + 70, cardY);
      cardY += 15;

      pdf.setFont("helvetica", "bold");
      pdf.text("DNI/CURP:", rightCol, cardY);
      pdf.setFont("helvetica", "normal");
      pdf.text(visitante.dni_curp || "N/A", rightCol + 70, cardY);

      // === MATERIAS (parte inferior de la tarjeta) ===
      cardY = yPos + cardHeight - 35;
      pdf.setFont("helvetica", "bold");
      pdf.text("Materias:", leftCol, cardY);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      
      if (visitante.materiasInteres && visitante.materiasInteres.length > 0) {
        const materias = Array.isArray(visitante.materiasInteres) 
          ? visitante.materiasInteres.join(", ") 
          : String(visitante.materiasInteres);
        const maxWidth = pageWidth - 100;
        const lines = pdf.splitTextToSize(materias, maxWidth);
        pdf.text(lines.slice(0, 2), leftCol, cardY + 12); // Máximo 2 líneas
      } else {
        pdf.text("Sin materias registradas", leftCol, cardY + 12);
      }

      yPos += cardHeight + 15;
      pdf.setFontSize(9);
    });

    // === PIE DE PÁGINA CON TOTAL ===
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = 30;
    }

    yPos += 10;
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total registros:", 30, yPos);
    pdf.text(String(visitantesData.length), 130, yPos);

    // === RETURN O DOWNLOAD ===
    if (returnBlob) {
      return pdf.output("blob");
    }

    const filename = tipoVisitante === "visitante_nacional" 
      ? "reporte_visitantes_nacionales.pdf"
      : "reporte_visitantes_internacionales.pdf";
    pdf.save(filename);
    return null;
  } catch (error) {
    alert("No se pudo generar el PDF de visitantes");
    console.error("Error generando PDF:", error);
    return null;
  }
};
