import { useState } from 'react';
import { certificateService } from '../services/certificate.service';
import Swal from 'sweetalert2';

export const useCertificate = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCertificate = async (inscripcionId: number) => {
    try {
      setIsGenerating(true);

      // Mostrar loading
      Swal.fire({
        title: 'Generando certificado...',
        text: 'Por favor espera mientras se genera tu certificado.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // 1. Obtener datos del certificado desde el backend
      const certificateData = await certificateService.getCertificateData(inscripcionId);

      // Verificar si los datos están completos
      if (!certificateData.studentName || certificateData.studentName === '________________') {
        Swal.close();
        Swal.fire({
          icon: 'warning',
          title: 'Datos incompletos',
          text: 'No se pudieron obtener los datos completos del estudiante. Verifica que la inscripción sea válida.',
          confirmButtonText: 'Entendido',
        });
        return null;
      }

      // 2. Generar el certificado y subirlo a Cloudinary
      const certificateUrl = await certificateService.generateAndUploadCertificate(certificateData);

      // 3. Registrar el certificado en la base de datos
      await certificateService.registerCertificate({
        inscripcion_id: inscripcionId,
        url_certificado: certificateUrl,
      });

      // Cerrar loading y mostrar opciones
      Swal.close();
      
      // Mostrar diálogo con opciones de descarga
      const result = await Swal.fire({
        icon: 'success',
        title: '¡Certificado generado exitosamente!',
        text: 'Tu certificado ha sido generado y guardado.',
        showCancelButton: true,
        confirmButtonText: 'Descargar PDF',
        cancelButtonText: 'Cerrar',
        denyButtonText: 'Descargar Imagen',
        showCloseButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
      });

      if (result.isConfirmed) {
        // Descargar como PDF
        try {
          await certificateService.generateAndDownloadPDF(certificateData);
          Swal.fire({
            icon: 'success',
            title: 'PDF Descargado',
            text: 'El certificado en formato PDF se ha descargado exitosamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error al descargar PDF',
            text: 'Hubo un problema al generar el PDF. Intenta descargar la imagen.',
          });
        }
      } else if (result.isDenied) {
        // Descargar como imagen
        downloadCertificate(certificateUrl, certificateData);
      }

      return certificateUrl;
    } catch (error) {
      console.error('Error al generar el certificado:', error);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al generar el certificado',
        text: 'Hubo un problema al generar tu certificado. Por favor intenta nuevamente.',
        confirmButtonText: 'Entendido',
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Función para descargar el certificado como imagen
  const downloadCertificate = (url: string, certificateData: any) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado_${certificateData.studentName}_${certificateData.studentApellido}_${certificateData.courseName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    generateCertificate,
    isGenerating,
  };
}; 