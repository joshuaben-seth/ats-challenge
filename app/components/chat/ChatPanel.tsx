'use client';

import { useRef, useEffect, useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Candidate } from '@/app/lib/api/candidates';
import type { TimelineEntry } from '@/app/lib/types';
import { processChatStream } from '@/app/lib/api/chat/stream';
import { Minimize2, Maximize2, Move } from 'lucide-react';

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

function DragHandle() {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'floating-chat-panel',
  });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-white transition-colors" title="Drag to move">
      <Move size={16} />
    </div>
  );
}

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
    bottom: position.y,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transform ? 'none' : undefined,
  };
  return (
    <div style={style}>
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
  const [isMinimized, setIsMinimized] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (position === null && typeof window !== 'undefined') {
      const panelWidth = 600;
      const margin = 20;
      
      const safeX = Math.max(margin, Math.min(window.innerWidth - panelWidth - margin, window.innerWidth - 400));
      const safeY = 50; // 50px from bottom
      
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
          chatInputRef.current?.focus();
          
          // Add completion entry to timeline
          onTimelineUpdate(prev => [...prev, {
            type: 'phase',
            id: `completion-${Date.now()}`,
            phase: 'completion',
            title: 'Query Completed',
            description: `Completed in ${duration.toFixed(2)} seconds`,
            timestamp: new Date(),
            data: { duration }
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
            y: pos!.y - event.delta.y
          }));
          setDragTransform(null);
        }
      }}
    >
      <FloatingDraggablePanel position={position} transform={dragTransform || undefined}>
        <div className="w-[600px] flex flex-col-reverse">
          <div className="shrink-0 pt-4">
            <ChatInput
              ref={chatInputRef}
              input={input}
              isLoading={isLoading}
              onInputChange={setInput}
              onSubmit={handleSubmit}
            />
          </div>
          
          <div className="relative min-h-14">
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2" data-tour="chat-controls">
              <div className="bg-background/50 backdrop-blur-sm p-1 rounded-lg">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)} 
                  className="text-gray-400 hover:text-white transition-colors w-5 h-5 flex items-center justify-center"
                  title={isMinimized ? 'Show messages' : 'Hide messages'}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
              </div>
              <div className="bg-background/50 backdrop-blur-sm p-1 rounded-lg">
                <div className="w-5 h-5 flex items-center justify-center">
                  <DragHandle />
                </div>
              </div>
            </div>

            <div
              className={`overflow-y-auto transition-all duration-300 ease-in-out ${isMinimized ? 'max-h-0 opacity-0' : 'max-h-[60vh] opacity-100'}`}
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 5%, black 20%)',
                maskImage: 'linear-gradient(to bottom, transparent 5%, black 20%)',
              }}
            >
              <div className={`px-4 ${messages.length === 0 ? 'pt-4' : 'pt-12'} pb-4 space-y-4 ${messages.length === 0 ? 'invisible' : ''}`}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex justify-start py-2">
                    <div className="text-xs text-muted-foreground px-3 py-2 rounded-full bg-secondary/30 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span>Working...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </FloatingDraggablePanel>
    </DndContext>
  );
} 