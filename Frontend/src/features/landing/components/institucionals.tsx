import SectionTitle from './SectionTitle';

const EducationLevelButtons = () => {
  const levels = [
    {
      name: 'Primario',
      svg: (
        <svg
          className="w-10 h-10 text-white group-hover:rotate-[8deg] transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
          <path d="M11 12.98L3 9.24v2.59l8 3.74 8-3.74V9.24l-8 3.74z" />
        </svg>
      ),
    },
    {
      name: 'Secundario',
      svg: (
        <svg
          className="w-10 h-10 text-green-400 group-hover:-rotate-[8deg] transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm0 4h16v2H4v-2z" />
        </svg>
      ),
    },
    {
      name: 'Bachillerato',
      svg: (
        <svg
          className="w-10 h-10 text-indigo-400 group-hover:rotate-[6deg] transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 3L1 9l11 6 9-4.5V17h2V9L12 3z" />
          <path d="M11 14.5L3 10.8v2.4l8 3.7 8-3.7v-2.4l-8 3.7z" />
        </svg>
      ),
    },
    {
      name: 'Superior',
      svg: (
        <svg
          className="w-10 h-10 text-red-400 group-hover:-rotate-[6deg] transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" />
          <path d="M6 13v5h2v-5H6zm10 0v5h2v-5h-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <SectionTitle
        title="Para todo tipo de nivel académico"
        paragraph="Varias instituciones utilizan nuestra página para compartir sus clases con los demás"
        center
      />
      <div className="flex gap-50 mx-auto text-center">
        {levels.map((level, index) => (
          <div>
            <div
              key={index}
              className="w-24 h-24 mb-5 flex items-center justify-center rounded-full border border-blue-300 bg-gradient-to-tr from-sky-200 via-sky-100 to-white shadow-lg 
            hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 
            transition-all duration-300 ease-out cursor-pointer hover:border-white/30 group overflow-hidden"
            >
              {level.svg}
            </div>
            <span className="text-sm text-black mt-2 text-center font-medium">
              {level.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EducationLevelButtons;
