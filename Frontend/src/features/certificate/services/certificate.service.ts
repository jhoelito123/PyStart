import { API_URL } from '../../../config/api-config';
import { postData, getData } from '../../../services/api-service';
import { createRoot } from 'react-dom/client';
import React from 'react';
import Certificate from '../components/certificate';

export interface CertificateData {
  studentName: string;
  studentApellido: string;
  courseName: string;
  duration: number;
  deanName: string;
  deanTitle: string;
  vicePresidentName: string;
  vicePresidentTitle: string;
  location: string;
  backgroundImage: string;
}

export interface CertificateRequest {
  inscripcion_id: number;
  url_certificado: string;
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = 'detfpihbr';
  const uploadPreset = 'pystart_cloudinary';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Error al subir el archivo a Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

const convertDurationToHours = (duration: string): number => {
  if (!duration) return 0;

  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    const totalHours = hours + minutes / 60 + seconds / 3600;

    return Math.round(totalHours * 100) / 100;
  }
  return 0;
};

export const certificateService = {
  async getCertificateData(inscripcionId: number): Promise<CertificateData> {
    try {
      const response = await getData(`/education/certificado/${inscripcionId}`);

      const certificateData: CertificateData = {
        studentName:
          response.estudiante?.nombre_estudiante || '________________',
        studentApellido:
          response.estudiante?.apellidos_estudiante || '______________',
        courseName:
          response.curso?.nombre_curso || '________________________________',
        duration: convertDurationToHours(response.curso?.duracion_curso) || 0,
        deanName: 'Lic. Andrea Quelali',
        deanTitle: 'Directora Ejecutiva',
        vicePresidentName: 'Sr. Adam Mamani',
        vicePresidentTitle: 'Fundador',
        location: 'COCHABAMBA-BOLIVIA',
        backgroundImage:
          response.curso?.portada_curso ||
          'https://w0.peakpx.com/wallpaper/658/609/HD-wallpaper-python-glitter-logo-programming-language-grid-metal-background-python-creative-programming-language-signs-python-logo.jpg',
      };

      return certificateData;
    } catch (error) {
      console.error('Error al obtener datos del certificado:', error);
      throw error;
    }
  },

  async registerCertificate(certificateData: CertificateRequest): Promise<any> {
    try {
      const response = await postData(
        '/education/certificado/create',
        certificateData,
      );
      return response;
    } catch (error) {
      console.error('Error al registrar el certificado:', error);
      throw error;
    }
  },

  async generateAndUploadCertificate(
    certificateData: CertificateData,
  ): Promise<string> {
    try {
      const html2canvas = (await import('html2canvas-pro')).default;

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '1200px';
      tempDiv.style.height = '800px';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);

      root.render(React.createElement(Certificate, { data: certificateData }));

      await new Promise((resolve) => setTimeout(resolve, 200));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: 800,
      });

      root.unmount();
      document.body.removeChild(tempDiv);

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });

      const file = new File([blob], 'certificado.png', { type: 'image/png' });

      const certificateUrl = await uploadToCloudinary(file);
      return certificateUrl;
    } catch (error) {
      console.error('Error al generar y subir el certificado:', error);
      throw error;
    }
  },

  async generateAndDownloadPDF(
    certificateData: CertificateData,
  ): Promise<void> {
    try {
      const html2canvas = (await import('html2canvas-pro')).default;
      const jsPDF = (await import('jspdf')).default;

      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '1200px';
      tempDiv.style.height = '800px';
      tempDiv.style.backgroundColor = 'white';
      document.body.appendChild(tempDiv);

      const root = createRoot(tempDiv);

      root.render(React.createElement(Certificate, { data: certificateData }));

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Generar la imagen
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: 800,
      });

      root.unmount();
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

      const fileName = `certificado_${certificateData.studentName}_${certificateData.studentApellido}_${certificateData.courseName}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    }
  },
};
