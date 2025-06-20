import React from 'react';

interface ChatIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  'aria-label': string;
}

export default function ChatIconButton({ children, className = '', ...props }: ChatIconButtonProps) {
  return (
    <button
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary/90 to-primary transition-all duration-200 hover:from-primary hover:to-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg border-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 