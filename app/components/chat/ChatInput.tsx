'use client';

import { Send, Mic } from 'lucide-react';
import ChatIconButton from './ChatIconButton';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({ input, isLoading, onInputChange, onSubmit }: ChatInputProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full px-4 pb-4 pt-2 bg-transparent"
      autoComplete="off"
    >
      <div
        className="w-full flex items-center bg-gradient-to-r from-secondary/80 to-secondary/60 backdrop-blur-sm rounded-full shadow-lg pl-6 pr-2 py-2 border border-border/50 transition-all duration-200 hover:shadow-xl chat-input"
      >
        <input
          type="text"
          className="flex-1 w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-base focus:ring-0"
          placeholder="Ask ATS-Lite anything..."
          value={input}
          onChange={e => onInputChange(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex items-center gap-2 ml-4">
          <ChatIconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </ChatIconButton>
          <ChatIconButton
            type="button"
            disabled={isLoading}
            aria-label="Audio input"
          >
            <Mic className="w-4 h-4 text-primary-foreground" />
          </ChatIconButton>
        </div>
      </div>
    </form>
  );
} 