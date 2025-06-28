export { AIAssistant } from './components/ai-assistant';
export { CodeAnalysisPanel } from './components/code-analysis';

export { useAIChat, useCodeAnalysis } from './hooks/use-ai';

export { aiService } from './services/ai-service';

export type {
  AIMessage,
  CourseContext,
  AIAssistantRequest,
  AIAssistantResponse,
  CodeAnalysisRequest,
  CodeAnalysisResponse,
  AnalysisType,
} from './types';
