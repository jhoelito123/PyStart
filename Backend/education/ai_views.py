from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .ai_service import get_ai_service

logger = logging.getLogger(__name__)

class AIAssistantView(APIView):
    
    def post(self, request, *args, **kwargs):
        try:
            # Obtener datos de la request
            user_message = request.data.get('message', '')
            context = request.data.get('context', {})
            conversation_history = request.data.get('conversationHistory', [])
            
            if not user_message:
                return Response(
                    {"error": "El mensaje es requerido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener servicio de IA
            ai_service = get_ai_service()
            if not ai_service:
                return Response(
                    {"response": "El servicio de IA no está disponible. Verifica tu configuración GROQ_API_KEY.", "success": False}, 
                    status=status.HTTP_200_OK
                )
            
            # Construir el prompt con contexto
            system_prompt = self._build_system_prompt(context)
            messages = self._build_conversation_messages(system_prompt, conversation_history, user_message)
            
            # Usar el servicio de IA
            ai_response = ai_service.get_ai_response(messages, max_tokens=1000)
            
            return Response({
                "response": ai_response,
                "success": True,
                "provider": "groq"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en AIAssistantView: {e}")
            return Response(
                {"response": "Lo siento, no pude procesar tu pregunta en este momento. Verifica tu configuración de IA.", "success": False}, 
                status=status.HTTP_200_OK
            )
    
    def _build_system_prompt(self, context):
        """Construye el prompt del sistema con el contexto del curso."""
        
        base_prompt = """Eres un asistente de IA especializado en enseñanza de programación Python para estudiantes principiantes a intermedios. Tu objetivo es ayudar a los estudiantes a entender conceptos, resolver ejercicios y debuggear código.

INSTRUCCIONES:
1. Responde en español de manera clara y educativa
2. Usa ejemplos de código cuando sea apropiado
3. Explica conceptos paso a paso
4. Sé paciente y alentador
5. Si hay errores en el código, explica qué está mal y cómo corregirlo
6. Sugiere mejores prácticas cuando sea relevante
7. Mantén las respuestas concisas pero completas (máximo 500 palabras)

PERSONALIDAD:
- Amigable y profesional
- Paciente con principiantes
- Entusiasta por la programación
- Enfocado en el aprendizaje práctico"""

        if context:
            course_name = context.get('courseName', '')
            section_name = context.get('sectionName', '')
            section_description = context.get('sectionDescription', '')
            exercise_code = context.get('exerciseCode', '')
            exercise_instructions = context.get('exerciseInstructions', '')
            
            context_prompt = f"""

CONTEXTO ACTUAL:
- Curso: {course_name}
- Sección: {section_name}
- Descripción: {section_description}
- Instrucciones del ejercicio: {exercise_instructions}
- Código actual del estudiante:
```python
{exercise_code}
```

Usa este contexto para dar respuestas más específicas y relevantes."""
            
            return base_prompt + context_prompt
        
        return base_prompt
    
    def _build_conversation_messages(self, system_prompt, history, current_message):
        """Construye la lista de mensajes para la conversación."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Añadir historial de conversación (limitado a los últimos 5 intercambios)
        for msg in history[-5:]:
            if msg.get('sender') == 'user':
                messages.append({"role": "user", "content": msg.get('content', '')})
            elif msg.get('sender') == 'ai':
                messages.append({"role": "assistant", "content": msg.get('content', '')})
        
        # Añadir mensaje actual
        messages.append({"role": "user", "content": current_message})
        
        return messages


class AICodeAnalysisView(APIView):
    """
    Endpoint específico para análisis de código usando IA GRATUITA
    """
    
    def post(self, request, *args, **kwargs):
        try:
            code = request.data.get('code', '')
            analysis_type = request.data.get('type', 'general')
            
            if not code:
                return Response(
                    {"error": "El código es requerido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Prompts específicos según el tipo de análisis
            prompts = {
                'debug': "Analiza este código Python y encuentra posibles errores o problemas. Explica qué está mal y cómo corregirlo:",
                'optimize': "Analiza este código Python y sugiere mejoras en términos de eficiencia, legibilidad y mejores prácticas:",
                'explain': "Explica línea por línea qué hace este código Python de manera educativa:",
                'general': "Analiza este código Python y proporciona feedback general incluyendo posibles errores, mejoras y explicaciones:"
            }
            
            prompt = prompts.get(analysis_type, prompts['general'])
            
            messages = [
                {
                    "role": "system", 
                    "content": "Eres un experto instructor de Python. Proporciona análisis claros y educativos del código en español."
                },
                {
                    "role": "user", 
                    "content": f"{prompt}\n\n```python\n{code}\n```"
                }
            ]
            
            ai_service = get_ai_service()
            if not ai_service:
                return Response(
                    {"analysis": "El servicio de IA no está disponible. Verifica tu configuración GROQ_API_KEY.", 
                     "code": code, "type": analysis_type, "success": False}, 
                    status=status.HTTP_200_OK
                )
            
            analysis = ai_service.get_ai_response(messages, max_tokens=800)
            
            return Response({
                "analysis": analysis,
                "code": code,
                "type": analysis_type,
                "success": True,
                "provider": "groq"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en análisis de código: {e}")
            return Response(
                {"analysis": "Lo siento, no pude analizar el código en este momento. Verifica tu configuración de IA.", 
                 "code": code, "type": analysis_type, "success": False}, 
                status=status.HTTP_200_OK
            )
