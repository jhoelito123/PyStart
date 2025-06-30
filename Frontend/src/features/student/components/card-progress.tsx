import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { useCertificate } from '../../certificate/hooks/use-certificate';
import { certificateService } from '../../certificate/services/certificate.service';

type ProgressCardProps = {
  id_inscripcion: number;
  nombre_curso: string;
  porcentaje_progreso: number;
  completado: boolean;
  fecha_inscripcion: string;
};

export const ProgressCard = ({
  id_inscripcion,
  nombre_curso,
  porcentaje_progreso,
  completado,
  fecha_inscripcion,
}: ProgressCardProps) => {
  const { generateCertificate, isGenerating } = useCertificate();
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isCheckingCertificate, setIsCheckingCertificate] = useState(false);

  useEffect(() => {
    const checkExistingCertificate = async () => {
      if (porcentaje_progreso === 100) {
        setIsCheckingCertificate(true);
        try {
          const certificateData =
            await certificateService.getCertificateData(id_inscripcion);
          setCertificateUrl('exists');
        } catch (error) {
          setCertificateUrl(null);
        } finally {
          setIsCheckingCertificate(false);
        }
      }
    };

    checkExistingCertificate();
  }, [id_inscripcion, porcentaje_progreso]);

  const handleGenerateCertificate = async () => {
    try {
      const url = await generateCertificate(id_inscripcion);
      setCertificateUrl(url);
    } catch (error) {
      console.error('Error en el componente:', error);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const certificateData =
        await certificateService.getCertificateData(id_inscripcion);
      await certificateService.generateAndDownloadPDF(certificateData);
    } catch (error) {
      console.error('Error al descargar el certificado:', error);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow p-5 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {nombre_curso}
          </h3>
          <p className="text-sm text-slate-700 mb-1">
            Inscrito el: {new Date(fecha_inscripcion).toLocaleDateString()}
          </p>
          <div className="w-full bg-neutral-200 rounded-full h-3 mt-2 mb-2">
            <div
              className="bg-emerald-500 h-3 rounded-full"
              style={{ width: `${porcentaje_progreso}%` }}
            />
          </div>
          <p className="text-sm text-slate-800">
            Progreso: {porcentaje_progreso.toFixed(0)}% –{' '}
            {completado ? 'Completado ' : 'En curso '}
          </p>
        </div>

        {porcentaje_progreso === 100 && (
          <div className="ml-4 flex flex-col gap-2">
            {isCheckingCertificate ? (
              <div className="text-sm text-gray-500">
                Verificando certificado...
              </div>
            ) : certificateUrl ? (
              <Button
                label="Generar Certificado"
                variantColor="variant3"
                onClick={handleDownloadCertificate}
                disabled={isGenerating}
              />
            ) : (
              <Button
                label="Generar Certificado"
                variantColor="variant3"
                onClick={handleGenerateCertificate}
                loading={isGenerating}
                loadingText="Generando..."
                disabled={isGenerating}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
