import { useState, useCallback } from 'react';
import { aiService } from '../services/ai-service';
import type {
  AIMessage,
  CourseContext,
  AIAssistantResponse,
  CodeAnalysisResponse,
  AnalysisType,
} from '../types';

export function useAIChat(context?: CourseContext) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((content: string, sender: 'user' | 'ai') => {
    const newMessage: AIMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(
    async (message: string): Promise<void> => {
      if (!message.trim()) return;

      setIsLoading(true);
      setError(null);

      // Agregar mensaje del usuario
      addMessage(message, 'user');

      try {
        const response: AIAssistantResponse = await aiService.askAssistant({
          message,
          context,
          conversationHistory: messages,
        });

        if (response.success) {
          addMessage(response.response, 'ai');
        } else {
          setError(response.error || 'Error desconocido');
          addMessage('Lo siento, ocurrió un error. Inténtalo de nuevo.', 'ai');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        addMessage('Lo siento, no pude procesar tu mensaje.', 'ai');
      } finally {
        setIsLoading(false);
      }
    },
    [context, messages, addMessage],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const getQuickSuggestions = useCallback(async (): Promise<string[]> => {
    if (!context) return [];
    return aiService.getQuickSuggestions(context);
  }, [context]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    getQuickSuggestions,
  };
}

export function useCodeAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<CodeAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCode = useCallback(
    async (code: string, type: AnalysisType): Promise<void> => {
      if (!code.trim()) return;

      setIsAnalyzing(true);
      setError(null);

      try {
        const result = await aiService.analyzeCode({ code, type });
        setAnalysisResult(result);

        if (!result.success) {
          setError(result.error || 'Error en el análisis');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [],
  );

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    analysisResult,
    error,
    analyzeCode,
    clearAnalysis,
  };
}
