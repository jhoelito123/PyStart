from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging
from .ai_service_isolated import get_ai_service 

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
            
            # **NUEVA FUNCIONALIDAD**: Detectar si el usuario pregunta sobre errores y hacer análisis automático
            code_analysis_result = None
            if self._is_asking_about_code_errors(user_message) and context and context.get('exerciseCode'):
                ai_service_instance = get_ai_service()
                if ai_service_instance:
                    code_analysis_result = ai_service_instance.analyze_python_code(context.get('exerciseCode', ''))
            
            messages = self._build_conversation_messages(system_prompt, conversation_history, user_message, code_analysis_result)
            
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
    
    def _is_asking_about_code_errors(self, message):
        """Detecta si el usuario está preguntando sobre errores en el código."""
        message_lower = message.lower()
        
        error_keywords = [
            'error', 'errores', 'problema', 'problemas', 'falla', 'fallas',
            'no funciona', 'mal', 'incorrecto', 'bug', 'debugg', 'revisar',
            'qué está mal', 'qué pasa', 'por qué no', 'funciona mal'
        ]
        
        return any(keyword in message_lower for keyword in error_keywords)
    
    def _build_conversation_messages(self, system_prompt, history, current_message, code_analysis=None):
        """Construye la lista de mensajes para la conversación, incluyendo análisis de código si está disponible."""
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Agregar historial de conversación
        for msg in history[-10:]:  # Últimos 10 mensajes para no sobrecargar
            role = "user" if msg.get('sender') == 'user' else "assistant"
            messages.append({"role": role, "content": msg.get('content', '')})
        
        # Si hay análisis de código automático, incluirlo en el mensaje del usuario
        final_user_message = current_message
        if code_analysis and code_analysis.get('has_issues'):
            analysis_info = "\\n\\n[ANÁLISIS AUTOMÁTICO DEL CÓDIGO DETECTADO]\\n"
            
            if code_analysis.get('errors'):
                analysis_info += "ERRORES ENCONTRADOS:\\n"
                for error in code_analysis['errors']:
                    analysis_info += f"- {error['type']} en línea {error['line']}: {error['message']}\\n"
            
            if code_analysis.get('warnings'):
                analysis_info += "ADVERTENCIAS ENCONTRADAS:\\n"
                for warning in code_analysis['warnings']:
                    analysis_info += f"- {warning['type']} en línea {warning['line']}: {warning['message']}\\n"
                    if 'suggestion' in warning:
                        analysis_info += f"  Sugerencia: {warning['suggestion']}\\n"
            
            final_user_message += analysis_info
        
        messages.append({"role": "user", "content": final_user_message})
        return messages


class AICodeAnalysisView(APIView):
    """
    Endpoint específico para análisis de código usando IA GRATUITA
    """
    
    def post(self, request, *args, **kwargs):
        try:
            # Obtener datos de la request
            code = request.data.get('code', '')
            analysis_type = request.data.get('type', 'debug')
            
            if not code:
                return Response(
                    {"error": "El código es requerido"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener servicio de IA
            ai_service = get_ai_service()
            if not ai_service:
                return Response(
                    {"analysis": "El servicio de IA no está disponible.", "success": False}, 
                    status=status.HTTP_200_OK
                )
            
            # Análisis automático de código Python
            code_analysis = ai_service.analyze_python_code(code)
            
            # Construir prompt para IA basado en el análisis
            if code_analysis['has_issues']:
                issues_text = "ERRORES DETECTADOS:\n"
                for error in code_analysis['errors']:
                    issues_text += f"- {error['type']} en línea {error['line']}: {error['message']}\n"
                
                for warning in code_analysis['warnings']:
                    issues_text += f"- {warning['type']} en línea {warning['line']}: {warning['message']}\n"
                    if 'suggestion' in warning:
                        issues_text += f"  Sugerencia: {warning['suggestion']}\n"
                
                prompt = f"""Analiza este código Python y ayuda al estudiante:

CÓDIGO:
```python
{code}
```

{issues_text}

Proporciona:
1. Explicación clara de los errores encontrados
2. Cómo corregirlos paso a paso
3. Código corregido
4. Mejores prácticas relevantes

Mantén la explicación educativa y alentadora."""
            else:
                # Si no hay errores, hacer análisis según el tipo
                type_prompts = {
                    'debug': 'Revisa si hay errores potenciales o mejoras en este código:',
                    'optimize': 'Sugiere optimizaciones para este código:',
                    'explain': 'Explica paso a paso cómo funciona este código:',
                    'general': 'Haz un análisis general de este código:'
                }
                
                prompt = f"""{type_prompts.get(analysis_type, type_prompts['general'])}

```python
{code}
```

Proporciona una respuesta educativa y constructiva."""
            
            # Obtener respuesta de IA
            messages = [
                {"role": "system", "content": "Eres un experto profesor de Python que ayuda a estudiantes a mejorar su código."},
                {"role": "user", "content": prompt}
            ]
            
            ai_response = ai_service.get_ai_response(messages, max_tokens=1500)
            
            return Response({
                "analysis": ai_response,
                "code": code,
                "type": analysis_type,
                "automatic_analysis": code_analysis,
                "success": True,
                "provider": "groq"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error en AICodeAnalysisView: {e}")
            return Response(
                {"analysis": "Lo siento, no pude analizar el código en este momento.", "success": False}, 
                status=status.HTTP_200_OK
            )
