import React from 'react';

interface AiQuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export const AiQuickReplies: React.FC<AiQuickRepliesProps> = ({ replies, onSelect }) => {
  return (
    <div className="p-2 flex flex-wrap gap-2 border-t border-gray-200">
      {replies.map(reply => (
        <button 
          key={reply} 
          onClick={() => onSelect(reply)}
          className="bg-gray-100 px-3 py-1 text-xs font-bold uppercase brutal-border hover:bg-black hover:text-[#D5FF00]"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
