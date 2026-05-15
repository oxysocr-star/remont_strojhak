export type AiRole = 'user' | 'model';

export interface AiMessage {
  role: AiRole;
  text: string;
}

export interface AiChatRequest {
  sessionId: string;
  message: string;
  history?: AiMessage[];
  pageContext?: string;
  leadData?: {
    area?: number;
    repairType?: string;
  };
}

export interface AiChatResponse {
  answer: string;
  suggestedActions?: string[];
  error?: string;
}
