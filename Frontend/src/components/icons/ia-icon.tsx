interface AIAssistantTriggerProps {
  onClick?: () => void;
}
export default function AIIcon({ onClick }: AIAssistantTriggerProps) {
  return (
    <div
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40 cursor-pointer"
    >
      <img
        src="/icons/ai-icon.webp"
        alt="AI Icon"
        width={34}
        height={34}
        loading="lazy"
      />
    </div>
  );
}
