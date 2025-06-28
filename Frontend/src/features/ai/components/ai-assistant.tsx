import React, { useRef, useEffect } from 'react';
import { useAIChat } from '../hooks/use-ai';
import type { CourseContext } from '../types';

interface AIAssistantProps {
  courseContext?: CourseContext;
  onClose?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  courseContext,
  onClose,
}) => {
  const { messages, isLoading, sendMessage, getQuickSuggestions } =
    useAIChat(courseContext);
  const [inputMessage, setInputMessage] = React.useState('');
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Cargar sugerencias rápidas
    getQuickSuggestions().then(setSuggestions);
  }, [getQuickSuggestions]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage('');
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const initialMessage = {
    id: 'initial',
    content: `¡Hola! Soy tu asistente de IA para el curso de Python. 

📚 **Contexto actual:** ${courseContext?.sectionName || 'Curso de Python'}

**Puedo ayudarte con:**
• Explicaciones sobre ${courseContext?.sectionName || 'la sección actual'}
• Dudas sobre el código y ejercicios
• Conceptos de programación en Python
• Debugging y resolución de errores
• Mejores prácticas de código

¿En qué puedo ayudarte?`,
    sender: 'ai' as const,
    timestamp: new Date(),
  };

  const allMessages = [initialMessage, ...messages];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h3 className="font-semibold">Asistente IA</h3>
            <span className="text-xs opacity-80">Powered by Groq</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {allMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <span className="text-sm text-gray-600 ml-2">
                    IA escribiendo...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {suggestions.length > 0 && messages.length === 0 && (
          <div className="px-4 py-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500">💡</span>
              <span className="text-xs font-medium text-gray-600">
                Sugerencias rápidas:
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t p-4">
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta aquí..."
              className="flex-1 p-2 border rounded-lg resize-none h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
