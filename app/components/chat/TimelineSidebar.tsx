'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import {
  History,
  Search,
  BrainCircuit,
  Filter,
  Target,
  MessageSquareText,
  CheckCircle2,
  Users,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import type { TimelineEntry } from '@/app/lib/types';
import JsonViewer from '../common/JsonViewer';

interface TimelineSidebarProps {
  timeline: TimelineEntry[];
  isVisible: boolean;
  onToggle: () => void;
}

const phaseIcons: Record<string, React.ElementType> = {
  query: Search,
  think: BrainCircuit,
  act1: Filter,
  act2: Target,
  speak: MessageSquareText,
  completion: CheckCircle,
};

const phaseColors: Record<string, string> = {
  query: 'bg-gray-400',
  think: 'bg-blue-500',
  act1: 'bg-green-500',
  act2: 'bg-purple-500',
  speak: 'bg-orange-500',
  completion: 'bg-emerald-500',
};

const timelineEntryVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const formatTimestamp = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export default function TimelineSidebar({ timeline, isVisible, onToggle }: TimelineSidebarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [previousLength, setPreviousLength] = useState(0);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [timeline]);

  useEffect(() => {
    setPreviousLength(timeline.length);
  }, [timeline.length]);

  return (
    <motion.div
      className="fixed left-0 top-0 h-full z-40 w-96 bg-background shadow-2xl border-r border-border flex flex-col"
      initial={{ x: '-24rem' }}
      animate={{ x: isVisible ? '0rem' : '-24rem' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.button
        onClick={onToggle}
        className="absolute top-4 z-50 bg-card rounded-md p-1 shadow-lg border border-border hover:bg-secondary"
        animate={{
          right: isVisible ? '-1rem' : 'auto',
          left: isVisible ? 'auto' : '24.5rem',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        data-tour={isVisible ? "timeline-minimize" : "timeline-toggle"}
      >
        {isVisible ? <ChevronLeft className="w-4 h-4 text-foreground" /> : <History className="w-4 h-4 text-foreground" />}
      </motion.button>
      
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Query History</h2>
      </div>
      
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-6">
        {timeline.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <History className="w-8 h-8 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No activity yet</p>
            <p className="text-sm">Run a query in the chat to see the execution timeline here.</p>
          </div>
        ) : (
          <div className="relative">
            {/* The timeline connecting line */}
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border -z-10" />
            
            <AnimatePresence initial={false}>
              {timeline.map((entry, index) => {
                const isQuery = entry.type === 'query';
                const isSimplePhase = !isQuery && (entry.phase === 'think' || entry.phase === 'speak');
                const Icon = isQuery ? phaseIcons.query : phaseIcons[entry.phase];
                const color = isQuery ? phaseColors.query : phaseColors[entry.phase];

                const nextEntryIsPhase = timeline[index + 1]?.type === 'phase';
                
                // Only animate new entries (those beyond the previous length)
                const isNewEntry = index >= previousLength;
                const animationDelay = isNewEntry ? (index - previousLength) * 0.2 : 0;

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    variants={timelineEntryVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ 
                      duration: 0.3, 
                      ease: 'easeInOut',
                      delay: animationDelay
                    }}
                  >
                    {isQuery && index > 0 && (
                      <hr className="my-8 border-border" />
                    )}
                    <div className={`relative ${isQuery ? 'pl-12' : 'pl-20 mt-6'}`}>
                      
                      {!isQuery && nextEntryIsPhase && (
                        <div className="absolute left-11 top-6 h-full w-0.5 bg-border -z-10" />
                      )}

                      <div className={`absolute left-0 top-1 w-5 h-5 rounded-full ${color} flex items-center justify-center ring-4 ring-background ${isQuery ? '' : 'left-8 w-4 h-4'}`}>
                        <Icon className={`text-white ${isQuery ? 'w-2.5 h-2.5' : 'w-2 h-2'}`} />
                      </div>
                      
                      <div className="flex flex-col">
                        {isSimplePhase ? (
                          <p className="italic text-foreground">{entry.description}</p>
                        ) : (
                          <p className="font-semibold text-foreground">
                            {isQuery ? `Query: "${entry.query}"` : entry.title}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">{formatTimestamp(entry.timestamp)}</p>

                        {entry.type === 'phase' && entry.phase === 'completion' && (
                          <div className="mt-2">
                            <div className="inline-flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/20 px-2.5 py-1 rounded-full">
                              <CheckCircle className="w-3 h-3" />
                              {entry.data?.duration && <span>Completed in {entry.data.duration.toFixed(2)}s</span>}
                            </div>
                          </div>
                        )}

                        {!isQuery && !isSimplePhase && entry.phase !== 'completion' && (
                          <div className="mt-2 p-3 bg-secondary/50 rounded-lg border border-border/50 text-sm">
                            <p className="text-muted-foreground italic mb-2">{entry.description}</p>
                            
                            <div className="space-y-2">
                              {entry.phase === 'act1' && entry.data?.matchCount !== undefined && (
                                <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
                                  <Users className="w-3 h-3" />
                                  <span>{entry.data.matchCount} candidates found</span>
                                </div>
                              )}

                              {entry.phase === 'act2' && entry.data?.rankedIds && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>{entry.data.rankedIds.length} candidates ranked</span>
                                  </div>
                                  
                                  {/* Ranked Candidate ID Pills */}
                                  <div className="flex flex-wrap gap-1">
                                    {entry.data.rankedIds.slice(0, 8).map((id, idx) => (
                                      <span
                                        key={id}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200"
                                        title={`Rank ${idx + 1}: Candidate ${id}`}
                                      >
                                        #{id}
                                      </span>
                                    ))}
                                    {entry.data.rankedIds.length > 8 && (
                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                        +{entry.data.rankedIds.length - 8} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {entry.phase === 'act1' && entry.data?.filterPlan && (
                                <JsonViewer title="View Filter Plan" jsonData={entry.data.filterPlan} />
                              )}
                              
                              {entry.phase === 'act2' && entry.data?.rankingPlan && (
                                <JsonViewer title="View Ranking Plan" jsonData={entry.data.rankingPlan} />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
} 