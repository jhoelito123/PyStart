import os
import logging
import ast
import io
import sys
import re  # Mover import al nivel del módulo
from contextlib import redirect_stderr, redirect_stdout
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
            try:
                # Inicialización simple y directa
                self.client = Groq(api_key=self.api_key)
                logger.info("Cliente Groq inicializado exitosamente")
            except Exception as e:
                logger.error(f"Error inicializando cliente Groq: {e}")
                raise Exception(f"No se pudo inicializar el cliente de Groq: {e}")
        return self.client
    
    def analyze_python_code(self, code):
        """
        Analiza código Python para detectar errores sintácticos y lógicos
        """
        errors = []
        warnings = []
        
        # 1. Verificar sintaxis con AST
        try:
            ast.parse(code)
        except SyntaxError as e:
            errors.append({
                'type': 'SyntaxError',
                'message': f"Error de sintaxis: {str(e)}",
                'line': e.lineno,
                'column': e.offset
            })
        
        # 2. Análisis línea por línea para detectar errores comunes
        lines = code.split('\n')
        defined_variables = set()
        function_parameters = {}
        
        for i, line in enumerate(lines, 1):
            line_stripped = line.strip()
            
            # Detectar definición de funciones y sus parámetros
            if line_stripped.startswith('def '):
                func_match = re.match(r'def\s+(\w+)\s*\(([^)]*)\)', line_stripped)
                if func_match:
                    func_name = func_match.group(1)
                    params_str = func_match.group(2)
                    # Extraer parámetros
                    params = [p.strip() for p in params_str.split(',') if p.strip()]
                    # Limpiar parámetros (quitar self, tipos, valores por defecto)
                    clean_params = []
                    for param in params:
                        param = param.split(':')[0].split('=')[0].strip()
                        if param and param != 'self':
                            clean_params.append(param)
                    function_parameters[func_name] = clean_params
                    defined_variables.update(clean_params)
            
            # Detectar asignaciones de variables
            if '=' in line_stripped and not line_stripped.startswith('#'):
                var_match = re.match(r'\s*(\w+)\s*=', line_stripped)
                if var_match:
                    defined_variables.add(var_match.group(1))
            
            # Detectar uso de variables no definidas
            if line_stripped and not line_stripped.startswith('#'):
                # Separar código de comentarios
                code_part = line_stripped.split('#')[0].strip()
                if code_part:
                    # Buscar variables usadas (excluyendo asignaciones)
                    words = re.findall(r'\b([a-zA-Z_]\w*)\b', code_part)
                    
                    # Obtener el lado izquierdo de asignaciones para no marcarlas como no definidas
                    assignment_vars = set()
                    if '=' in code_part and not any(op in code_part for op in ['==', '!=', '<=', '>=']):
                        left_side = code_part.split('=')[0]
                        assignment_vars.update(re.findall(r'\b([a-zA-Z_]\w*)\b', left_side))
                    
                    for word in words:
                        if (word not in ['self', 'True', 'False', 'None', 'print', 'len', 'str', 'int', 'float', 'list', 'dict', 'range', 'def', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'class', 'append', 'items', 'push'] 
                            and word not in defined_variables 
                            and word not in assignment_vars
                            and not word.isdigit()
                            and '.' + word not in code_part):  # No es un método
                            
                            warnings.append({
                                'type': 'NameError',
                                'message': f"Variable '{word}' no está definida",
                                'line': i,
                                'suggestion': self._suggest_variable_fix(word, defined_variables)
                            })
            
            # Detectar líneas que parecen código inválido (solo letras sin estructura)
            if (line_stripped and 
                not line_stripped.startswith('#') and 
                not any(keyword in line_stripped for keyword in ['def', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from', 'class', '=', '(', ')']) and
                re.match(r'^[a-zA-Z]+$', line_stripped)):
                errors.append({
                    'type': 'InvalidSyntax',
                    'message': f"Línea inválida: '{line_stripped}' no es código Python válido",
                    'line': i,
                    'suggestion': "Esta línea parece ser texto aleatorio. ¿Es un comentario? Usa # al inicio."
                })
                # No analizar esta línea más para evitar duplicados
                continue
        
        # 3. Análisis adicional con compile (para errores más profundos)
        try:
            compile(code, '<string>', 'exec')
        except SyntaxError as e:
            if not any(err['line'] == e.lineno for err in errors):  # Evitar duplicados
                errors.append({
                    'type': 'CompileError',
                    'message': f"Error de compilación: {str(e)}",
                    'line': e.lineno,
                    'column': getattr(e, 'offset', None)
                })
        except Exception as e:
            errors.append({
                'type': 'GeneralError',
                'message': f"Error general: {str(e)}",
                'line': None,
                'column': None
            })
        
        return {
            'errors': errors,
            'warnings': warnings,
            'has_issues': len(errors) > 0 or len(warnings) > 0,
            'defined_variables': list(defined_variables),
            'function_parameters': function_parameters
        }
    
    def _suggest_variable_fix(self, wrong_var, defined_vars):
        """Sugiere correcciones para variables mal escritas"""
        import difflib
        
        # Buscar variables similares
        close_matches = difflib.get_close_matches(wrong_var, defined_vars, n=1, cutoff=0.6)
        if close_matches:
            return f"¿Quisiste decir '{close_matches[0]}'?"
        
        return "Verifica que la variable esté definida correctamente."
        
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
