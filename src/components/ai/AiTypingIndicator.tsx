import React from 'react';

export const AiTypingIndicator = () => (
  <div className="bg-white p-3 brutal-border self-start flex gap-1">
    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
  </div>
);
