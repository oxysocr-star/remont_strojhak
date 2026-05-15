import React from 'react';
import { AiRole } from '../../types';

interface AiMessageProps {
  role: AiRole | 'user' | 'model';
  text: string;
}

export const AiMessage: React.FC<AiMessageProps> = ({ role, text }) => {
  const isUser = role === 'user';
  
  return (
    <div className={`ai-message-item max-w-[85%] p-4 brutal-border ${isUser ? 'bg-[#D5FF00] self-end' : 'bg-white self-start'}`}>
      <span className="font-medium text-sm whitespace-pre-wrap">{text}</span>
    </div>
  );
};
