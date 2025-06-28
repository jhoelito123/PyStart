import os
import logging
from groq import Groq

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        if not self.api_key:
            raise Exception("GROQ_API_KEY no está configurada en el archivo .env")
        
        self.client = None  # Inicializaremos cuando sea necesario
        self.model = "llama3-8b-8192"  # Modelo gratis disponible

    def _get_client(self):
        """Inicializa el cliente de Groq solo cuando se necesita"""
        if self.client is None:
            self.client = Groq(api_key=self.api_key)
        return self.client
        
    def get_ai_response(self, messages, max_tokens=1000):
        """
        Obtiene respuesta de IA usando Groq
        """
        try:
            client = self._get_client()
            response = client.chat.completions.create(
                model=self.model,
                messages=messages,
                max_tokens=max_tokens,
                temperature=0.7,
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"Error en Groq API: {e}")
            return "Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo."


# Función para obtener instancia del servicio (inicialización perezosa)
def get_ai_service():
    try:
        return AIService()
    except Exception as e:
        logger.error(f"Error inicializando AI Service: {e}")
        return None
