type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  phase?: 'think' | 'act1' | 'act2' | 'speak' | 'error';
  phaseData?: Record<string, unknown>;
};

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'system') {
    return (
      <div className="flex justify-start py-2 animate-fade-in">
        <div className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-secondary/30">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } animate-fade-in`}
    >
      <div
        className={`max-w-[85%] rounded-2xl p-4 chat-message shadow-sm transition-all duration-200 hover:shadow-md ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-4'
            : 'bg-gradient-to-br from-secondary/80 to-secondary/60 text-secondary-foreground mr-4 border border-border/30'
        }`}
        style={{
          boxShadow: message.role === 'user' 
            ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <p className="whitespace-pre-wrap text-base leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
} 