import os
import logging
import ast
import re
import subprocess
import json
import tempfile
import sys

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise Exception("GROQ_API_KEY no está configurada en el archivo .env")

        self.model = "llama3-8b-8192"

    def _execute_groq_request(self, messages, max_tokens=1000):
        """Ejecuta una petición a Groq en un proceso aislado"""
        try:
            # Crear script temporal para ejecutar Groq
            script_content = f"""
import os
import sys
import json

# Limpiar todas las variables de proxy
proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'NO_PROXY', 'no_proxy', 'ALL_PROXY', 'all_proxy']
for var in proxy_vars:
    if var in os.environ:
        del os.environ[var]

try:
    from groq import Groq
    
    client = Groq(api_key="{self.api_key}")
    
    messages = {json.dumps(messages)}
    
    response = client.chat.completions.create(
        model="{self.model}",
        messages=messages,
        max_tokens={max_tokens},
        temperature=0.7,
    )
    
    result = response.choices[0].message.content
    print("SUCCESS:" + result)
    
except Exception as e:
    print("ERROR:" + str(e))
"""

            with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
                f.write(script_content)
                temp_script = f.name

            try:
                # Ejecutar en proceso completamente aislado
                env = os.environ.copy()
                # Limpiar variables de proxy del entorno
                proxy_vars = [
                    "HTTP_PROXY",
                    "HTTPS_PROXY",
                    "http_proxy",
                    "https_proxy",
                    "NO_PROXY",
                    "no_proxy",
                ]
                for var in proxy_vars:
                    env.pop(var, None)

                result = subprocess.run(
                    [sys.executable, temp_script],
                    capture_output=True,
                    text=True,
                    env=env,
                    timeout=30,
                )

                if result.stdout.startswith("SUCCESS:"):
                    return result.stdout[8:]  # Quitar "SUCCESS:"
                else:
                    logger.error(
                        f"Error en proceso aislado: {result.stdout} {result.stderr}"
                    )
                    return "Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo."

            finally:
                # Limpiar archivo temporal
                try:
                    os.unlink(temp_script)
                except:
                    pass

        except Exception as e:
            logger.error(f"Error ejecutando Groq aislado: {e}")
            return "Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo."

    def analyze_python_code(self, code):
        """Analiza código Python para detectar errores"""
        errors = []
        warnings = []

        # Verificar sintaxis con AST
        try:
            ast.parse(code)
        except SyntaxError as e:
            errors.append(
                {
                    "type": "SyntaxError",
                    "message": f"Error de sintaxis: {str(e)}",
                    "line": e.lineno,
                    "column": e.offset,
                }
            )

        # Análisis básico de variables
        lines = code.split("\n")
        defined_variables = set()

        for i, line in enumerate(lines, 1):
            line_stripped = line.strip()

            # Detectar asignaciones de variables
            if "=" in line_stripped and not line_stripped.startswith("#"):
                var_match = re.match(r"\s*(\w+)\s*=", line_stripped)
                if var_match:
                    defined_variables.add(var_match.group(1))

            # Detectar uso de variables no definidas
            if line_stripped and not line_stripped.startswith("#"):
                code_part = line_stripped.split("#")[0].strip()
                if code_part:
                    words = re.findall(r"\b([a-zA-Z_]\w*)\b", code_part)

                    assignment_vars = set()
                    if "=" in code_part and not any(
                        op in code_part for op in ["==", "!=", "<=", ">="]
                    ):
                        left_side = code_part.split("=")[0]
                        assignment_vars.update(
                            re.findall(r"\b([a-zA-Z_]\w*)\b", left_side)
                        )

                    for word in words:
                        if (
                            word
                            not in [
                                "self",
                                "True",
                                "False",
                                "None",
                                "print",
                                "len",
                                "str",
                                "int",
                                "float",
                                "list",
                                "dict",
                                "range",
                                "def",
                                "if",
                                "else",
                                "elif",
                                "for",
                                "while",
                                "return",
                                "import",
                                "from",
                                "class",
                                "append",
                                "items",
                            ]
                            and word not in defined_variables
                            and word not in assignment_vars
                            and not word.isdigit()
                        ):

                            warnings.append(
                                {
                                    "type": "NameError",
                                    "message": f"Variable '{word}' no está definida",
                                    "line": i,
                                    "suggestion": "Verifica que la variable esté definida correctamente.",
                                }
                            )

        return {
            "errors": errors,
            "warnings": warnings,
            "has_issues": len(errors) > 0 or len(warnings) > 0,
            "defined_variables": list(defined_variables),
        }

    def get_ai_response(self, messages, max_tokens=1000):
        """Obtiene respuesta de IA usando Groq en proceso aislado"""
        try:
            result = self._execute_groq_request(messages, max_tokens)
            if "Lo siento" not in result:
                logger.info("Respuesta de Groq recibida exitosamente")
            return result

        except Exception as e:
            logger.error(f"Error en Groq API: {e}")
            return "Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo."


# Función para obtener instancia del servicio
def get_ai_service():
    try:
        return AIService()
    except Exception as e:
        logger.error(f"Error inicializando AI Service: {e}")
        return None
