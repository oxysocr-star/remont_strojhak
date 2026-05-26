import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from './AiChatWindow';

interface AiMessageProps {
  message: ChatMessage;
}

export const AiMessage: React.FC<AiMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] border-2 p-3 font-medium text-sm leading-relaxed ${
          isUser 
            ? 'bg-[#D5FF00] border-black text-black shadow-[4px_4px_0_0_#000]' 
            : 'bg-black border-[#D5FF00] text-white shadow-[4px_4px_0_0_#D5FF00]'
        }`}
      >
        {!isUser ? (
            <div className="text-white space-y-2 text-sm leading-relaxed marker:text-[#D5FF00] [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-4 [&>h3]:font-bold [&>h3]:text-[#D5FF00]">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
        ) : (
            <span>{message.content}</span>
        )}
      </div>
    </div>
  );
};
