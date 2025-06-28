import { useState } from 'react';
import CodeEditor from '../../../components/ui/code-editor';
import { API_URL } from '../../../config/api-config';
import axios from 'axios';

export default function Ejecutor({
  initialCode = '',
  onCodeChange,
}: {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
}) {
  const [code, setCode] = useState<string>(initialCode);
  const [output, setOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleCodeChange = (newCode: string | undefined) => {
    const codeFinal = newCode || '';
    setCode(codeFinal);
    if (onCodeChange) {
      onCodeChange(codeFinal);
    }
  };

  const handleExecuteCode = async () => {
    setLoading(true);
    setOutput(''); // Limpia la salida al iniciar la ejecución

    try {
      const response = await axios.post(`${API_URL}/education/execute-code/`, {
        code,
        language: 'python',
      });
      const data = response.data;

      if (data.status === 'success') {
        setOutput(data.output);
      } else {
        setOutput(`Estado: ${data.status.toUpperCase()}\n${data.output}`);
      }
    } catch (error) {
      console.error('Error al ejecutar código:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setOutput(
            `Error del servidor (${error.response.status}):\n${JSON.stringify(
              error.response.data,
              null,
              2,
            )}`,
          );
        } else if (error.request) {
          setOutput(
            'Error de conexión: No se recibió respuesta del servidor. Verifica tu conexión o la URL del backend.',
          );
        } else {
          setOutput(
            `Error inesperado al preparar la petición: ${error.message}`,
          );
        }
      } else {
        setOutput(
          `Error inesperado: ${
            error instanceof Error ? error.message : String(error)
          }.`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CodeEditor
        code={code}
        language="python"
        onCodeChange={handleCodeChange}
        output={output}
        loading={loading}
        onExecute={handleExecuteCode}
      />
    </div>
  );
}
