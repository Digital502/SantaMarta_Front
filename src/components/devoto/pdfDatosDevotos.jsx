import jsPDF from "jspdf";
import html2canvas from "html2canvas";
<link href="https://fonts.googleapis.com/css2?family=Merriweather&display=swap" rel="stylesheet" />

const cmToPx = (cm, dpi = 96) => (cm * dpi) / 2.54;

export const pdfDatosDevotos = async (devotos) => {
  const pdf = new jsPDF({
    unit: "cm",
    format: "letter", // hoja carta: 21.59 x 27.94 cm
  });

  const tarjetaWidth = 6.5;
  const tarjetaHeight = 2.5;
  const margenX = 0.5;
  const margenY = 0.5;

  const paginasAncho = 3; // 3 tarjetas en fila
  const paginasAlto = 10; // 10 tarjetas en columna

  // Para controlar posición x,y de cada tarjeta
  let x = margenX;
  let y = margenY;

  for (let i = 0; i < devotos.length; i++) {
    const devoto = devotos[i];

    // Crear div temporal para la tarjeta
    const canvasWidth = cmToPx(tarjetaWidth);
    const canvasHeight = cmToPx(tarjetaHeight);

    const div = document.createElement("div");
    div.style.width = `${canvasWidth}px`;
    div.style.height = `${canvasHeight}px`;
    div.style.display = "flex";
    div.style.flexDirection = "column";
    div.style.justifyContent = "center";
    div.style.backgroundColor = "white";
    div.style.padding = "10px 15px";
    div.style.border = "1px solid #ddd";
    div.style.borderRadius = "5px";
    div.style.fontFamily = "'Merriweather', serif";
    div.style.color = "#000";

    // Contenido interno similar al de la imagen
    div.innerHTML = `
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">
        ${devoto.nombre || ""}
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 12px;">
        <div>
          <div style="font-weight: bold; margin-bottom: 2px;">Contraseña</div>
          <div>${devoto.contraseña || ""}</div>
        </div>
        <div>
          <div style="font-weight: bold; margin-bottom: 2px;">Turno</div>
          <div>${devoto.noTurno || ""}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(div);

    // Esperar la captura de canvas (html2canvas)
    const canvas = await html2canvas(div, { 
      scale: 3, 
      backgroundColor: "#fff",
      width: canvasWidth,
      height: canvasHeight
    });
    const imgData = canvas.toDataURL("image/png");

    // Agregar imagen al pdf en la posición (x, y)
    pdf.addImage(imgData, "PNG", x, y, tarjetaWidth, tarjetaHeight);

    div.remove();

    // Mover posición para la siguiente tarjeta
    if ((i + 1) % paginasAncho === 0) {
      // Fin de fila: reinicia X y baja Y
      x = margenX;
      y += tarjetaHeight + 0.3; // un pequeño margen entre tarjetas vertical
    } else {
      // Siguiente columna a la derecha
      x += tarjetaWidth + 0.3; // margen horizontal entre tarjetas
    }

    // Si llegamos al final de la página en Y, añadir página nueva y resetear
    if (((i + 1) % (paginasAncho * paginasAlto)) === 0 && i !== devotos.length - 1) {
      pdf.addPage();
      x = margenX;
      y = margenY;
    }
  }

  pdf.save("devotos.pdf");
};