import React from 'react';

interface CertificateData {
  studentName: string;
  courseName: string;
  duration: number;
  deanName: string;
  deanTitle: string;
  vicePresidentName: string;
  vicePresidentTitle: string;
  location: string;
  backgroundImage: string;
}

interface CertificateProps {
  data?: CertificateData;
}

const Certificate: React.FC<CertificateProps> = ({ 
  data = {
    studentName: "________________",
    courseName: "________________________________",
    duration: 0,
    deanName: "Prof.(Dr.) Deepshikha Kalra",
    deanTitle: "Dean, MERI",
    vicePresidentName: "Prof. Lalit Aggarwal",
    vicePresidentTitle: "Vice President, MERI",
    location: "COCHABAMBA-BOLIVIA",
    backgroundImage: undefined
  }
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white relative overflow-hidden" style={{ aspectRatio: '1.414/1' }}>
      <div className="absolute inset-0" style={{ backgroundColor: '#F9F6F3', border: "solid" }}></div>
      
      {/* Main content container */}
      <div className="relative z-10 h-full flex">
        {/* Left side - Certificate content */}
        <div className="flex-1 p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <img className='h-12' src='..\public\icons\pystart.png' alt="Logon't"/>
            </div>
            <div className="text-black font-bold text-xl italic">
              Dev<span className="underline">Mente</span>
            </div>
          </div>

          <div className="mb-12">
            <h1 className="text-6xl font-black text-black leading-tight">
              CERTIFICADO
            </h1>
            <h2 className="text-3xl font-bold text-black mt-2">
              DE APROBACIÓN
            </h2>
          </div>

          {/* Certificate body */}
          <div className="flex-1 space-y-6 text-lg text-black">
            <div className="flex items-center">
              <span>Se otorga el presente certificado al estudiante:</span>
              <span className="ml-2 font-bold border-b-2 border-black pb-1 min-w-0 flex-1">
                {data.studentName}
              </span>
            </div>

            <div className="mt-8">
              <p className="mb-4">por haber completado exitosamente el curso de:</p>
              <div className="border-b-2 border-black pb-2 mb-4">
                <span className="font-bold text-xl">{data.courseName}</span>
              </div>
              <div className="flex items-center">
                <span>con una duración de</span>
                <span className="mx-2 font-bold border-b-2 border-black pb-1 px-2">
                  {data.duration || "____"}
                </span>
                <span>horas académicas.</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-12 flex justify-between">
            <div className="text-center">
              <div className="text-sm font-medium">{data.deanName}</div>
              <div className="text-xs text-gray-600">{data.deanTitle}</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium">{data.vicePresidentName}</div>
              <div className="text-xs text-gray-600">{data.vicePresidentTitle}</div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-8 text-center">
            <span className="text-lg font-bold text-black">{data.location}</span>
          </div>
        </div>

        <div className="w-1/3 relative">
          {data.backgroundImage ? (
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                backgroundImage: `url(${data.backgroundImage})`
                }}
            >
            </div>
            ) : (
            <div className="absolute inset-0 bg-gradient-to-l from-red-900 via-red-800 to-red-700"></div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;