import { API_URL } from '../../../config/api-config';
import type {
  AIAssistantRequest,
  AIAssistantResponse,
  CodeAnalysisRequest,
  CodeAnalysisResponse,
  CourseContext,
} from '../types';

class AIService {
  private baseURL = `${API_URL}/education`;

  /**
   * Envía una pregunta al asistente de IA
   */
  async askAssistant(
    request: AIAssistantRequest,
  ): Promise<AIAssistantResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ai-assistant/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Error al comunicarse con el asistente',
        );
      }

      return await response.json();
    } catch (error) {
      console.error('Error en askAssistant:', error);
      return {
        response:
          'Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo.',
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Analiza código con IA
   */
  async analyzeCode(
    request: CodeAnalysisRequest,
  ): Promise<CodeAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseURL}/ai-code-analysis/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar el código');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en analyzeCode:', error);
      return {
        analysis: 'Lo siento, no pude analizar el código en este momento.',
        code: request.code,
        type: request.type,
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Genera sugerencias rápidas basadas en el contexto del curso
   */
  async getQuickSuggestions(context: CourseContext): Promise<string[]> {
    const suggestions = [
      `¿Cómo funciona ${context.sectionName.toLowerCase()}?`,
      'Explícame este código paso a paso',
      '¿Hay algún error en mi código?',
      '¿Cómo puedo mejorar este código?',
      'Dame un ejemplo similar',
      '¿Cuáles son las mejores prácticas aquí?',
    ];

    return suggestions;
  }

  /**
   * Detecta la intención del usuario basada en el mensaje
   */
  detectIntent(message: string): 'debug' | 'optimize' | 'explain' | 'general' {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('error') ||
      lowerMessage.includes('no funciona')
    ) {
      return 'debug';
    }

    if (lowerMessage.includes('mejor') || lowerMessage.includes('optimiz')) {
      return 'optimize';
    }

    if (lowerMessage.includes('explica') || lowerMessage.includes('cómo')) {
      return 'explain';
    }

    return 'general';
  }

  /**
   * Verifica si el servicio de IA está disponible
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/ai-assistant/`, {
        method: 'OPTIONS',
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Instancia singleton del servicio
export const aiService = new AIService();
export default aiService;
