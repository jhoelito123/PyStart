import Ejecutor from './editor-code';
type CardShowSectionProps = {
  title: string;
  video: string;
  text: string;
  code: string;
};

export default function CardShowSection({
  title,
  video,
  text,
  code,
}: CardShowSectionProps) {
  return (
    <div className="flex flex-col h-screen">
      <h2 className="subtitle-lg text-slate-900 my-4"> {title}</h2>

      <div className="flex">
        <div className="flex flex-col items-start pr-6">
          <iframe
            src={video}
            title={title}
            allowFullScreen
            className="w-2xl h-96 object-cover"
          ></iframe>
          <div className="my-4 w-2xl body-lg text-slate-800 overflow-y-auto max-h-40">
            {text}
          </div>
        </div>

        <div className="flex flex-col overflow-y-auto w-full">
          <Ejecutor initialCode={code} />
        </div>
      </div>
    </div>
  );
}
