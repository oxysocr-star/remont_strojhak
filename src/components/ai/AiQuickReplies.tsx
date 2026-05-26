import React from 'react';

interface AiQuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export const AiQuickReplies: React.FC<AiQuickRepliesProps> = ({ replies, onSelect }) => {
  return (
    <>
      {replies.map((reply, i) => (
        <button
          key={i}
          onClick={() => onSelect(reply)}
          className="inline-block border-2 border-[#D5FF00] bg-black text-white hover:bg-[#D5FF00] hover:text-black px-3 py-2 text-xs font-bold uppercase tracking-wide transition-colors shadow-[4px_4px_0_0_#D5FF00] shrink-0 whitespace-nowrap"
        >
          {reply}
        </button>
      ))}
    </>
  );
};
