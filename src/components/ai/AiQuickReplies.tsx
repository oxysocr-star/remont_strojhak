import React from 'react';

interface AiQuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export const AiQuickReplies: React.FC<AiQuickRepliesProps> = ({ replies, onSelect }) => {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 py-2">
      {replies.map(reply => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="bg-black text-[#D5FF00] border-4 border-[#D5FF00] px-4 py-2 font-bold text-sm uppercase transition-transform active:translate-y-1 active:translate-x-1 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0_0_#D5FF00] hover:bg-[#D5FF00] hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D5FF00]"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};
