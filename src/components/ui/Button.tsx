import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    let baseStyle = "flex items-center justify-center font-bold font-display uppercase transition-all brutal-border focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black ";
    
    if (variant === 'primary') {
      baseStyle += "bg-[#D5FF00] text-black brutal-shadow brutal-shadow-hover brutal-shadow-active hover:bg-black hover:text-[#D5FF00] ";
    } else if (variant === 'secondary') {
      baseStyle += "bg-black text-white brutal-shadow brutal-shadow-hover brutal-shadow-active hover:bg-[#D5FF00] hover:text-black ";
    } else if (variant === 'outline') {
      baseStyle += "bg-white text-black hover:bg-black hover:text-white ";
    }

    if (size === 'sm') {
      baseStyle += "px-4 py-2 text-sm ";
    } else if (size === 'md') {
      baseStyle += "px-6 py-3 text-base ";
    } else if (size === 'lg') {
      baseStyle += "px-8 py-4 text-lg ";
    }

    return (
      <button ref={ref} className={`${baseStyle} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
