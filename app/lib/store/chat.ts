import { create } from 'zustand';
import type { TimelineEntry } from '@/app/lib/types';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  phase?: 'think' | 'act1' | 'act2' | 'speak' | 'error';
  phaseData?: Record<string, unknown>;
};

interface ChatState {
  messages: Message[];
  input: string;
  loading: boolean;
  isMinimized: boolean;
  position: { x: number; y: number } | null;
  dragTransform: { x: number; y: number } | null;
  timelineEntries: TimelineEntry[];
}

interface ChatActions {
  setInput: (input: string) => void;
  setLoading: (loading: boolean) => void;
  setIsMinimized: (minimized: boolean) => void;
  setPosition: (position: { x: number; y: number } | null) => void;
  setDragTransform: (transform: { x: number; y: number } | null) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  addTimelineEntry: (entry: TimelineEntry) => void;
  updateTimelineEntry: (id: string, updates: any) => void;
  clearTimeline: () => void;
  timelineUpdater: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
}

export const useChatStore = create<ChatState & ChatActions>((set) => ({
  // Initial state
  messages: [],
  input: '',
  loading: false,
  isMinimized: false,
  position: null,
  dragTransform: null,
  timelineEntries: [],

  // Actions
  setInput: (input) => set({ input }),
  setLoading: (loading) => set({ loading }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setPosition: (position) => set({ position }),
  setDragTransform: (dragTransform) => set({ dragTransform }),
  
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),
  
  clearMessages: () => set({ messages: [] }),
  
  addTimelineEntry: (entry) => set((state) => ({ 
    timelineEntries: [...state.timelineEntries, entry] 
  })),
  
  updateTimelineEntry: (id, updates) => set((state) => ({
    timelineEntries: state.timelineEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } as TimelineEntry : entry
    )
  })),
  
  clearTimeline: () => set({ timelineEntries: [] }),

  timelineUpdater: (entries) => set((state) => ({ 
    timelineEntries: typeof entries === 'function' ? entries(state.timelineEntries) : entries 
  })),
})); 