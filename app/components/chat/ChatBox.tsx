'use client';

import ChatPanel from './ChatPanel';
import type { Candidate } from '@/app/lib/candidates';

type ChatBoxProps = {
  setFilteredCandidates: (candidates: Candidate[] | undefined) => void;
};

export default function ChatBox({ setFilteredCandidates }: ChatBoxProps) {
  return <ChatPanel setFilteredCandidates={setFilteredCandidates} />;
} 