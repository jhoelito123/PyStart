import { useRef } from 'react';
import Certificate from '../components/certificate';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';

function GenerateCertificate() {
  const certificateRef = useRef<HTMLDivElement>(null);

  const certificateData = {
    studentName: 'Juan Rodrigo',
    studentApellido: 'Loza Lazcano',
    courseName: 'Desarrollo Web con React',
    duration: 120,
    deanName: 'Lic. Andrea Quelali',
    deanTitle: 'Directora Ejecutiva',
    vicePresidentName: 'Sr. Adam Mamani',
    vicePresidentTitle: 'Fundador',
    location: 'COCHABAMBA-BOLIVIA',
    backgroundImage: 'https://i.ytimg.com/vi/5qap5aO4i9A/maxresdefault.jpg',
  };

  const downloadPDF = async () => {
    const input = certificateRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2, // mayor calidad
      useCORS: true, // permite cargar imágenes externas
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('certificado.pdf');
  };

  return (
    <div className="p-4">
      {/* Contenedor que se va a capturar */}
      <div ref={certificateRef}>
        <Certificate data={certificateData} />
      </div>

      {/* Botón para exportar */}
      <div className="text-center mt-8">
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          Descargar como PDF
        </button>
      </div>
    </div>
  );
}

export default GenerateCertificate;
