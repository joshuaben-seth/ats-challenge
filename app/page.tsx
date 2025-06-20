'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CandidatesTable from './components/candidates/CandidatesTable';
import ChatPanel from './components/chat/ChatPanel';
import TimelineSidebar from './components/chat/TimelineSidebar';
import type { Candidate } from './lib/candidates';
import type { TimelineEntry } from './lib/types';

export default function Home() {
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[] | undefined>(undefined);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <TimelineSidebar
        timeline={timelineEntries}
        isVisible={isSidebarVisible}
        onToggle={() => setIsSidebarVisible(!isSidebarVisible)}
      />
      
      <div className="flex-1 min-w-0">
        <motion.main
          className="h-full p-6"
          animate={{ x: isSidebarVisible ? '24rem' : '0rem' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <CandidatesTable filteredCandidates={filteredCandidates} />
        </motion.main>
      </div>
      <ChatPanel
        setFilteredCandidates={setFilteredCandidates}
        onTimelineUpdate={setTimelineEntries}
      />
    </div>
  );
}
