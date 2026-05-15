import React from 'react';

interface AiMessageProps {
  role: 'user' | 'ai';
  text: string;
}

export const AiMessage: React.FC<AiMessageProps> = ({ role, text }) => {
  const isUser = role === 'user';
  return (
    <div className={`p-4 border-4 max-w-[85%] ${isUser ? 'border-[#D5FF00] bg-[#D5FF00] text-black self-end' : 'border-white bg-black text-white self-start'}`}>
      <span className="font-bold text-sm tracking-wide">{text}</span>
    </div>
  );
};
