'use client';

import { Send, Mic } from 'lucide-react';
import ChatIconButton from './ChatIconButton';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(({ input, isLoading, onInputChange, onSubmit }, ref) => {
  const [isListening, setIsListening] = useState(false);
  const [transcriptionStatus, setTranscriptionStatus] = useState<'idle' | 'transcribing' | 'error'>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const longPressRef = useRef(false);

  useImperativeHandle(ref, () => localInputRef.current!);

  const handleAudio = async (audioBlob: Blob) => {
    setTranscriptionStatus('transcribing');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      onInputChange(data.text);
      setTranscriptionStatus('idle');
      localInputRef.current?.focus();
    } catch (error) {
      console.error(error);
      setTranscriptionStatus('error');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const startListening = async () => {
    if (isListening) {
      stopListening();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);
      setTranscriptionStatus('idle');
      onInputChange('');
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        handleAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsListening(false);
      setTranscriptionStatus('error');
    }
  };

  useEffect(() => {
    let pressTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm' && !isListening && !isLoading) {
        if (pressTimer === null) {
          longPressRef.current = false;
          pressTimer = setTimeout(() => {
            event.preventDefault();
            startListening();
            longPressRef.current = true;
          }, 200);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }

        if (isListening) {
          event.preventDefault();
          stopListening();
        } else if (!longPressRef.current) {
          // Don't prevent default - let the character be typed normally
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup',handleKeyUp);
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [isListening, isLoading, input, onInputChange]);

  return (
    <form
      onSubmit={onSubmit}
      className="w-full px-4 pb-4 pt-2 bg-transparent"
      autoComplete="off"
      data-tour="chat-input"
    >
      <div className="w-full flex items-center bg-gradient-to-r from-secondary/80 to-secondary/60 backdrop-blur-sm rounded-full shadow-lg pl-6 pr-2 py-2 border border-border/50 transition-all duration-200 hover:shadow-xl chat-input">
        <input
          ref={localInputRef}
          type="text"
          className="flex-1 w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-base focus:ring-0"
          placeholder={isListening ? 'Listening...' : 'Ask ATS-Lite anything... or hold [M] to speak'}
          value={input}
          onChange={e => onInputChange(e.target.value)}
          disabled={isLoading || isListening}
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
            onClick={startListening}
            disabled={isLoading}
            aria-label="Audio input"
            isListening={isListening}
          >
            <Mic className="w-4 h-4 text-primary-foreground" />
          </ChatIconButton>
        </div>
      </div>
      {transcriptionStatus === 'transcribing' && <p className="text-xs text-muted-foreground text-center mt-2">Transcribing your masterpiece...</p>}
      {transcriptionStatus === 'error' && <p className="text-xs text-red-500 text-center mt-2">Sorry, I had trouble catching that. Please try again.</p>}
    </form>
  );
});

ChatInput.displayName = 'ChatInput';
export default ChatInput; 