import Ejecutor from './editor-code';
type CardShowSectionProps = {
  title: string;
  video: string;
  codeInstruction: string;
  text: string;
  code: string;
  onCodeChange?: (code: string) => void;
};

export default function CardShowSection({
  title,
  video,
  codeInstruction,
  text,
  code,
  onCodeChange,
}: CardShowSectionProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="subtitle-lg text-slate-900 my-2 mt-4"> {title}</h2>

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
          <div className="flex flex-col w-full rounded-md shadow-lg border-t border-slate-200 overflow-hidden">
            <div className="h-2 bg-emerald-500 w-full" />
            <div className="px-4 py-2 border-b border-slate-200">
              <p className="body-md text-slate-900 italic">{codeInstruction}</p>
            </div>
          </div>
          <Ejecutor initialCode={code} onCodeChange={onCodeChange} />
        </div>
      </div>
    </div>
  );
}
