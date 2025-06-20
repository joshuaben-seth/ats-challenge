'use client';

import ChatPanel from './ChatPanel';
import type { Candidate } from '@/app/lib/candidates';
import type { TimelineEntry } from '@/app/lib/types';

type ChatBoxProps = {
  setFilteredCandidates: (candidates: Candidate[] | undefined) => void;
  onTimelineUpdate: React.Dispatch<React.SetStateAction<TimelineEntry[]>>;
};

export default function ChatBox({ setFilteredCandidates, onTimelineUpdate }: ChatBoxProps) {
  return <ChatPanel setFilteredCandidates={setFilteredCandidates} onTimelineUpdate={onTimelineUpdate} />;
} 