'use client';

import { useRef, useEffect, useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Candidate } from '@/app/lib/candidates';
import type { TimelineEntry } from '@/app/lib/types';
import { processChatStream } from '@/app/lib/chat/stream';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  phase?: 'think' | 'act1' | 'act2' | 'speak' | 'error';
  phaseData?: Record<string, unknown>;
};

const isUserOrAssistant = (message: Message): message is Message & { role: 'user' | 'assistant' } => {
  return message.role === 'user' || message.role === 'assistant';
}

type ChatPanelProps = {
  setFilteredCandidates: (candidates: Candidate[] | undefined) => void;
  onTimelineUpdate: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
};

function FloatingDraggablePanel({
  children,
  position,
  transform,
}: {
  children: React.ReactNode;
  position: { x: number; y: number };
  transform?: { x: number; y: number };
}) {
  const style: React.CSSProperties = {
    position: 'fixed',
    zIndex: 50,
    left: position.x,
    top: position.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transform ? 'none' : undefined,
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
}

function DraggableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'floating-chat-panel',
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function ChatPanel({ setFilteredCandidates, onTimelineUpdate }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragTransform, setDragTransform] = useState<{ x: number; y: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (position === null && typeof window !== 'undefined') {
      const panelWidth = 700;
      const panelHeight = 600;
      const margin = 20;
      
      // Calculate safe position that keeps the panel fully visible
      const safeX = Math.max(margin, Math.min(window.innerWidth - panelWidth - margin, window.innerWidth - 400));
      const safeY = Math.max(margin, Math.min(window.innerHeight - panelHeight - margin, window.innerHeight - 300));
      
      setPosition({
        x: safeX,
        y: safeY
      });
    }
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    // Add a marker for the new query in the timeline
    onTimelineUpdate(prev => [...prev, {
        type: 'query',
        id: userMessage.id,
        timestamp: new Date(),
        query: userMessage.content
    }]);

    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: '', phase: 'speak' }]);

    await processChatStream(
      newMessages
        .filter(isUserOrAssistant)
        .map(({ role, content }) => ({ role, content })),
      userMessage.id,
      {
        onTimelineUpdate,
        onCandidatesFound: (candidates) => {
          setFilteredCandidates(candidates);
        },
        onSummaryChunk: (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId ? { ...msg, content: msg.content + chunk } : msg
          ));
        },
        onStreamEnd: ({ duration }) => {
          setIsLoading(false);
          setMessages(prev => [...prev, {
            id: `completion-${Date.now()}`,
            role: 'system',
            content: `✅ Completed in ${duration.toFixed(2)} seconds`,
          }]);
        },
        onError: () => {
          setIsLoading(false);
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: 'Sorry, there was an error processing your request.', phase: 'error' } 
              : msg
          ));
        },
      }
    );
  };

  if (!position) {
    return null;
  }

  return (
    <DndContext
      onDragStart={() => {
        setDragTransform({ x: 0, y: 0 });
      }}
      onDragMove={event => {
        if (event.active.id === 'floating-chat-panel' && event.delta) {
          setDragTransform(event.delta);
        }
      }}
      onDragEnd={event => {
        if (event.active.id === 'floating-chat-panel' && event.delta) {
          setPosition(pos => ({
            x: pos!.x + event.delta.x,
            y: pos!.y + event.delta.y
          }));
          setDragTransform(null);
        }
      }}
    >
      <FloatingDraggablePanel position={position} transform={dragTransform || undefined}>
        <div
          className={`bg-card/95 backdrop-blur-sm text-foreground rounded-2xl shadow-2xl border border-border/50 transition-all duration-300 ease-in-out w-[700px] h-[600px] overflow-hidden glass-effect`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Header */}
          <DraggableHeader>
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-secondary/80 to-secondary/60 backdrop-blur-sm border-b border-border/30 cursor-move">
              <div className="flex items-center gap-3 text-foreground">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">A</span>
                </div>
                <div>
                  <span className="text-sm font-semibold">ATS-Lite</span>
                  <div className="text-xs text-muted-foreground">AI Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </DraggableHeader>
          {/* Content */}
          <div className="flex flex-col h-[calc(100%-76px)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-background/95 chat-container">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Welcome to ATS-Lite</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Ask me anything about candidates, filtering, or analysis. I&apos;m here to help!
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && !messages.some(m => m.role === 'assistant') && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span className="ml-2">Working...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="shrink-0">
              <ChatInput
                input={input}
                isLoading={isLoading}
                onInputChange={setInput}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </div>
      </FloatingDraggablePanel>
    </DndContext>
  );
} 