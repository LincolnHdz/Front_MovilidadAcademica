import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ReporteBecaEiffel = ({
  datos = [],
  carrera = "Carrera de prueba",
  universidad = "UASLP",
  logoBase64 = null,
}) => {
  const generarPDF = () => {
    const fecha = new Date().toLocaleDateString();

    // Convertir los datos a filas para la tabla
    const filas = datos.map((alumno) => [
      alumno.nombre,
      alumno.destino,
      alumno.tipoBeca,
      alumno.clave,
      alumno.carrera,
      alumno.mes,
    ]);

    const dd = {
      pageSize: "LETTER",
      pageMargins: [40, 90, 40, 40],

      header: {
        margin: [40, 20],
        columns: [
          {
            width: 60,
            height: 60,
            stack: [
              logoBase64
                ? { image: logoBase64, width: 60, height: 60 }
                : {
                    canvas: [
                      {
                        type: "rect",
                        x: 0,
                        y: 0,
                        w: 60,
                        h: 60,
                        color: "#cccccc",
                      },
                    ],
                  },
            ],
          },
          {
            width: "*",
            alignment: "center",
            stack: [
              {
                text: "UNIVERSIDAD AUTÓNOMA DE SAN LUIS POTOSÍ",
                fontSize: 14,
                bold: true,
              },
              {
                text: "COORDINACIÓN DE MOVILIDAD ESTUDIANTIL",
                fontSize: 11,
                margin: [0, 3, 0, 0],
              },
              {
                text: "REPORTE DE BECARIOS – BECA EIFFEL",
                fontSize: 12,
                bold: true,
                margin: [0, 3, 0, 0],
              },
            ],
          },
          { width: 60, text: "" },
        ],
      },

      content: [
        {
          style: "infoTable",
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                { text: "Carrera:", bold: true },
                { text: carrera, colSpan: 2 },
                {},
              ],
              [
                { text: "Universidad:", bold: true },
                { text: universidad, colSpan: 2 },
                {},
              ],
              [
                { text: "Fecha de generación:", bold: true },
                { text: fecha, colSpan: 2 },
                {},
              ],
            ],
          },
        },

        { text: "\nLISTA DE ESTUDIANTES BECARIOS EIFFEL", style: "sectionTitle" },

        {
          style: "mainTable",
          table: {
            headerRows: 1,
            widths: [140, 80, 70, 70, 70, 60],

            body: [
              [
                { text: "NOMBRE", style: "tableHeader" },
                { text: "UNIV. DESTINO", style: "tableHeader" },
                { text: "TIPO BECA", style: "tableHeader" },
                { text: "CLAVE", style: "tableHeader" },
                { text: "CARRERA", style: "tableHeader" },
                { text: "MES", style: "tableHeader" },
              ],
              ...filas,
            ],
          },

          layout: {
            fillColor: function (rowIndex) {
              return rowIndex === 0 ? "#2E74B6" : null;
            },
            hLineWidth: () => 0.6,
            vLineWidth: () => 0.6,
            hLineColor: "#b4b4b4",
            vLineColor: "#b4b4b4",
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4,
          },
        },
      ],

      styles: {
        sectionTitle: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 6],
        },
        tableHeader: {
          bold: true,
          color: "white",
          alignment: "center",
          fontSize: 10,
        },
        infoTable: {
          margin: [0, 0, 0, 15],
        },
        mainTable: {
          margin: [0, 10, 0, 0],
        },
      },
    };

    pdfMake.createPdf(dd).download("reporte_beca_eiffel.pdf");
  };

  return (
    <button
      onClick={generarPDF}
      style={{
        padding: "10px 20px",
        background: "#2E74B6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Descargar Reporte
    </button>
  );
};

export default ReporteBecaEiffel;



/* codigo para modificar en playground de pdfmake
var dd = {
  pageSize: "LETTER",
  pageMargins: [40, 90, 40, 40],

  header: {
    margin: [40, 20],
    columns: [
      {
        width: 60,
        height: 60,
        stack: [
          { 
            canvas: [
              { type: 'rect', x: 0, y: 0, w: 60, h: 60, r: 0, color: '#cccccc' }
            ]
          }
        ]
      },
      {
        width: '*',
        alignment: 'center',
        stack: [
          { text: 'UNIVERSIDAD AUTÓNOMA DE SAN LUIS POTOSÍ', fontSize: 14, bold: true },
          { text: 'COORDINACIÓN DE MOVILIDAD ESTUDIANTIL', fontSize: 11, margin: [0, 3, 0, 0] },
          { text: 'REPORTE DE BECARIOS – BECA EIFFEL', fontSize: 12, bold: true, margin: [0, 3, 0, 0] }
        ]
      },
      { width: 60, text: "" }
    ]
  },

  content: [
    {
      style: "infoTable",
      table: {
        widths: ['*', '*', '*'],
        body: [
          [
            { text: "Carrera:", bold: true }, 
            { text: "Ingeniería Mecatrónica (Prueba)", colSpan: 2 }, 
            {}
          ],
          [
            { text: "Universidad:", bold: true }, 
            { text: "UASLP", colSpan: 2 }, 
            {}
          ],
          [
            { text: "Fecha de generación:", bold: true },
            { text: new Date().toLocaleDateString(), colSpan: 2 },
            {}
          ]
        ]
      }
    },

    { text: "\nLISTA DE ESTUDIANTES BECARIOS EIFFEL", style: "sectionTitle" },

    {
      style: "mainTable",
      table: {
        headerRows: 1,
        widths: [120, 80, 60, 70, 70, 60],
        body: [
          [
            { text: "NOMBRE", style: "tableHeader" },
            { text: "UNIV. DESTINO", style: "tableHeader" },
            { text: "TIPO BECA", style: "tableHeader" },
            { text: "CLAVE", style: "tableHeader" },
            { text: "CARRERA", style: "tableHeader" },
            { text: "MES", style: "tableHeader" }
          ],

          ["Juan Pérez Ramírez", "École Centrale", "Beca Eiffel", "299001", "IME", "Julio–Julio"],
          ["Ana Torres García", "École Centrale", "Beca Eiffel", "298554", "IMA", "Julio–Julio"],
          ["Luis Mendoza Díaz", "École Centrale", "Beca Eiffel", "300112", "IMT", "Julio–Julio"],
          ["María López Tovar", "École Centrale", "Beca Eiffel", "297843", "IME", "Julio–Julio"],
          ["Daniela Ortiz Vega", "École Centrale", "Beca Eiffel", "301556", "IMA", "Julio–Julio"],
          ["Carlos Gómez Ruiz", "École Centrale", "Beca Eiffel", "298744", "IMT", "Julio–Julio"],
          ["Fernanda Rivas Soto", "École Centrale", "Beca Eiffel", "299871", "IME", "Julio–Julio"],
          ["Miguel Ayala Silva", "École Centrale", "Beca Eiffel", "302001", "IMA", "Julio–Julio"],
          ["Valeria Cano Mata", "École Centrale", "Beca Eiffel", "300887", "IMT", "Julio–Julio"],
          ["Eduardo Sánchez Lara", "École Centrale", "Beca Eiffel", "296990", "IME", "Julio–Julio"]
        ]
      },
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? '#2E74B6' : null;
        },
        hLineWidth: function(i, node){ return 0.6; },
        vLineWidth: function(i, node){ return 0.6; },
        hLineColor: '#b4b4b4',
        vLineColor: '#b4b4b4',
        paddingLeft: function(i){ return 6; },
        paddingRight: function(i){ return 6; },
        paddingTop: function(i){ return 4; },
        paddingBottom: function(i){ return 4; }
      }
    }
  ],

  styles: {
    sectionTitle: {
      fontSize: 13,
      bold: true,
      margin: [0, 10, 0, 6]
    },
    tableHeader: {
      bold: true,
      color: "white",
      alignment: "center",
      fontSize: 10
    },
    infoTable: {
      margin: [0, 0, 0, 15]
    },
    mainTable: {
      margin: [0, 10, 0, 0]
    }
  }
};

*/