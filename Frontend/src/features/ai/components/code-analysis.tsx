import React from 'react';
import { useCodeAnalysis } from '../hooks/use-ai';
import type { AnalysisType } from '../types';

interface CodeAnalysisProps {
  code: string;
  onAnalysisComplete?: (analysis: string) => void;
}

const analysisOptions: {
  type: AnalysisType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    type: 'debug',
    label: 'Buscar Errores',
    icon: '🐛',
    description: 'Encuentra errores y problemas en el código',
  },
  {
    type: 'optimize',
    label: 'Optimizar',
    icon: '⚡',
    description: 'Mejora la eficiencia y rendimiento',
  },
  {
    type: 'explain',
    label: 'Explicar',
    icon: '💡',
    description: 'Explica cómo funciona el código paso a paso',
  },
  {
    type: 'general',
    label: 'Análisis General',
    icon: '📋',
    description: 'Análisis completo del código',
  },
];

export const CodeAnalysisPanel: React.FC<CodeAnalysisProps> = ({
  code,
  onAnalysisComplete,
}) => {
  const { isAnalyzing, analysisResult, error, analyzeCode, clearAnalysis } =
    useCodeAnalysis();

  const handleAnalyze = async (type: AnalysisType) => {
    if (!code.trim()) {
      return;
    }

    await analyzeCode(code, type);

    if (analysisResult?.success && onAnalysisComplete) {
      onAnalysisComplete(analysisResult.analysis);
    }
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h4 key={index} className="font-bold text-gray-800 mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (line.startsWith('*') || line.startsWith('-')) {
        return (
          <li key={index} className="ml-4 text-gray-700">
            {line.substring(1).trim()}
          </li>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="text-gray-700 mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span>🤖</span>
            Análisis de Código IA
          </h3>
          {analysisResult && (
            <button
              onClick={clearAnalysis}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Analysis Options */}
      <div className="p-4">
        {!code.trim() ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl block mb-2">📝</span>
            <p>Escribe código en el editor para poder analizarlo</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {analysisOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleAnalyze(option.type)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
                  title={option.description}
                >
                  <span className="text-xl">{option.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isAnalyzing && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-gray-600">Analizando código...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-red-700 font-medium">Error</span>
                </div>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            )}

            {/* Analysis Result */}
            {analysisResult && analysisResult.success && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">
                    {analysisOptions.find(
                      (opt) => opt.type === analysisResult.type,
                    )?.icon || '📋'}
                  </span>
                  <h4 className="font-semibold text-gray-800">
                    {analysisOptions.find(
                      (opt) => opt.type === analysisResult.type,
                    )?.label || 'Análisis'}
                  </h4>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Groq IA
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  {formatAnalysis(analysisResult.analysis)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
