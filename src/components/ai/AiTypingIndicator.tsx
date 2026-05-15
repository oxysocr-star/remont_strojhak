import React from 'react';
import { motion } from 'motion/react';

export const AiTypingIndicator: React.FC = () => {
  return (
    <div className="p-4 border-4 border-white bg-black text-[#D5FF00] self-start max-w-[85%] flex items-center gap-2">
      <motion.span 
        className="w-3 h-3 bg-[#D5FF00] block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1] }}
      />
      <motion.span 
        className="w-3 h-3 bg-[#D5FF00] block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.2 }}
      />
      <motion.span 
        className="w-3 h-3 bg-[#D5FF00] block"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], delay: 0.4 }}
      />
    </div>
  );
};
