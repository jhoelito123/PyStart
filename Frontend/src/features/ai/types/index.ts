export interface AIMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface CourseContext {
  courseName: string;
  sectionName: string;
  sectionDescription: string;
  exerciseCode: string;
  exerciseInstructions: string;
}

export interface AIAssistantRequest {
  message: string;
  context?: CourseContext;
  conversationHistory?: AIMessage[];
}

export interface AIAssistantResponse {
  response: string;
  success: boolean;
  error?: string;
  provider?: string;
}

export interface CodeAnalysisRequest {
  code: string;
  type: 'debug' | 'optimize' | 'explain' | 'general';
}

export interface CodeAnalysisResponse {
  analysis: string;
  code: string;
  type: string;
  success: boolean;
  error?: string;
  provider?: string;
}

export type AnalysisType = 'debug' | 'optimize' | 'explain' | 'general';
