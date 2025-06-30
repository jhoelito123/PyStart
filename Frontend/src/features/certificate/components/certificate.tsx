import React from 'react';

interface CertificateData {
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

interface CertificateProps {
  data?: CertificateData;
}

// Función para formatear la duración de manera profesional
const formatDuration = (duration: number): string => {
  if (!duration || duration === 0) return "0 horas";
  
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  
  if (hours > 0 && minutes > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  } else if (minutes > 0) {
    return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
  } else {
    return "menos de 1 minuto";
  }
};

const Certificate: React.FC<CertificateProps> = ({ 
  data = {
    studentName: "________________",
    studentApellido: "______________",
    courseName: "________________________________",
    duration: 0,
    deanName: "Lic. Andrea Quelali",
    deanTitle: "Directora Ejecutiva",
    vicePresidentName: "Sr. Adam Mamani", 
    vicePresidentTitle: "Fundador",
    location: "COCHABAMBA-BOLIVIA",
    backgroundImage: "https://w0.peakpx.com/wallpaper/658/609/HD-wallpaper-python-glitter-logo-programming-language-grid-metal-background-python-creative-programming-language-signs-python-logo.jpg"
  }
}) => {
  const formattedDuration = formatDuration(data.duration);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white relative overflow-hidden" style={{ aspectRatio: '11/8.5' }}>
      <div className="absolute inset-0" style={{ backgroundColor: '#F9F6F3', border: "solid" }}></div>
      
      {/* Main content container */}
      <div className="relative z-10 h-full flex">
        {/* Left side - Certificate content */}
        <div className="flex-1 p-8 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <img className='h-12 drop-shadow-lg' src='..\public\icons\pystart.png' alt="Logon't"/>
            </div>
            <div className="text-black font-bold text-xl">
              <img className='h-12 drop-shadow-lg' src='..\public\icons\logoDevmente.png' alt="Logon't"/>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-7xl font-black text-black leading-tight text-center">
              CERTIFICADO
            </h1>
            <h2 className="text-3xl font-bold text-black mt-2 text-center">
              DE APROBACIÓN
            </h2>
          </div>

          {/* Certificate body */}
          <div className="flex-1 space-y-3.5 text-lg text-black">
            <div className="flex items-center">
              <span>Se otorga el presente certificado de aprobación al estudiante:</span>
              
            </div>
            <div className="flex items-center">
              <span className="ml-2 font-bold border-b-2 border-black pb-1 min-w-0 flex-1 text-center">
                {data.studentName} {data.studentApellido}
              </span>
            </div>

            <div className="mt-8">
              <p className="mb-4">por haber completado exitosamente el curso de:</p>
              <div className="border-b-2 border-black pb-2 mb-4 flex">
                <span className="ml-2 font-bold min-w-0 flex-1 text-center">
                {data.courseName}
              </span>              </div>
              <div className="flex items-center">
                <span>con una duración de</span>
                <span className="mx-2 font-bold border-b-2 border-black pb-1 px-2">
                  {formattedDuration}
                </span>
                <span>académicos.</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-7 flex justify-between">
            <div className="text-center">
                <img 
                    src="../public/images/firmaALQQ.png" 
                    alt="Vice President Signature" 
                    className="h-14 mx-auto -mb-3.5 object-contain"
                />
              <div className="text-sm font-medium border-t-2 border-black">{data.deanName}</div>
              <div className="text-xs text-gray-600">{data.deanTitle}</div>
            </div>
            <div className="text-center">
                <img 
                    src="../public/images/firmaAJM.png" 
                    alt="Vice President Signature" 
                    className="h-14 mx-auto -mb-3.5 object-contain"
                />
              <div className="text-sm font-medium border-t-2 border-black">{data.vicePresidentName}</div>
              <div className="text-xs text-gray-600">{data.vicePresidentTitle}</div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-7 text-center">
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
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                backgroundImage: `url(https://w0.peakpx.com/wallpaper/658/609/HD-wallpaper-python-glitter-logo-programming-language-grid-metal-background-python-creative-programming-language-signs-python-logo.jpg)`
                }}
            >
            </div>            
          )}
        </div>
      </div>
    </div>
  );
};

export default Certificate;