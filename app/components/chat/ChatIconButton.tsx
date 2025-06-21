'use client';

import React from 'react';
import ListeningBars from './ListeningBars';

interface ChatIconButtonProps {
  children: React.ReactNode;
  type: 'submit' | 'button';
  disabled?: boolean;
  'aria-label': string;
  onClick?: () => void;
  isListening?: boolean;
}

export default function ChatIconButton({ children, isListening, ...props }: ChatIconButtonProps) {
  return (
    <button
      {...props}
      className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/80 text-primary-foreground shadow-md transition-all duration-200 enabled:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${isListening ? 'bg-primary scale-105' : ''}`}
    >
      {isListening ? <ListeningBars /> : children}
    </button>
  );
} 