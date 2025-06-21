'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidatesTable from './components/candidates/CandidatesTable';
import ChatPanel from './components/chat/ChatPanel';
import TimelineSidebar from './components/chat/TimelineSidebar';
import IntroAnimation from './components/IntroAnimation';
import OnboardingTour from './components/OnboardingTour';
import { HelpCircle } from 'lucide-react';
import type { Candidate } from './lib/candidates';
import type { TimelineEntry } from './lib/types';

export default function Home() {
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[] | undefined>(undefined);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    // Automatically hide the intro after a certain time, 
    // in case the onAnimationComplete callback doesn't fire for some reason.
    const timer = setTimeout(() => {
      if (showIntro) {
        setShowIntro(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    // Wait for intro to finish and components to load before checking tour status
    if (!showIntro) {
      const timer = setTimeout(() => {
        setComponentsLoaded(true);
        checkTourStatus();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showIntro]);

  const checkTourStatus = () => {
    const tourCompleted = localStorage.getItem('tour-completed');
    const tourSkipped = localStorage.getItem('tour-skipped');
    
    // If user hasn't seen the tour before, show it automatically
    if (!tourCompleted && !tourSkipped) {
      setTimeout(() => {
        setShowTour(true);
      }, 1000); // Small delay to ensure everything is rendered
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
    // Save to localStorage that the user has completed the tour
    localStorage.setItem('tour-completed', 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    // Save to localStorage that the user has skipped the tour
    localStorage.setItem('tour-skipped', 'true');
  };

  const startTour = () => {
    setShowTour(true);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.3 }} // Reduced from 0.5s to 0.3s
      >
        <div className="flex h-screen bg-background text-foreground bottom-gradient">
          <TimelineSidebar
            timeline={timelineEntries}
            isVisible={isSidebarVisible}
            onToggle={() => setIsSidebarVisible(!isSidebarVisible)}
          />
          
          <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarVisible ? 'ml-96' : 'ml-0'}`}>
            <motion.main
              className="h-full p-6"
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <CandidatesTable filteredCandidates={filteredCandidates} onStartTour={startTour} />
            </motion.main>
          </div>
          <ChatPanel
            setFilteredCandidates={setFilteredCandidates}
            onTimelineUpdate={setTimelineEntries}
          />
        </div>
      </motion.div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showTour && componentsLoaded}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />
    </>
  );
}
