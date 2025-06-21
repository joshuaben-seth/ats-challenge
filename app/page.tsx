'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CandidatesTable from './components/candidates/CandidatesTable';
import ChatPanel from './components/chat/ChatPanel';
import TimelineSidebar from './components/chat/TimelineSidebar';
import IntroAnimation from './components/IntroAnimation';
import OnboardingTour from './components/OnboardingTour';
import { useCandidatesStore, useChatStore, useUIStore, useTourStore } from './lib/store';
import { fadeInVariants } from './lib/ui/animations';

export default function Home() {
  // Get state and actions from stores
  const { 
    filteredCandidates, 
    setFilteredCandidates, 
    fetchCandidates 
  } = useCandidatesStore();
  
  const { 
    timelineEntries, 
    timelineUpdater 
  } = useChatStore();
  
  const { 
    isSidebarVisible, 
    showIntro, 
    componentsLoaded,
    setShowIntro, 
    setComponentsLoaded,
    toggleSidebar 
  } = useUIStore();
  
  const { 
    showTour, 
    completeTour, 
    skipTour, 
    startTour, 
    checkTourStatus 
  } = useTourStore();

  // Initialize data
  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Handle tour status after intro
  useEffect(() => {
    if (!showIntro) {
      setComponentsLoaded(true);
      checkTourStatus();
    }
  }, [showIntro, setComponentsLoaded, checkTourStatus]);

  return (
    <>
      <AnimatePresence>
        {showIntro && <IntroAnimation onAnimationComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <motion.div 
        variants={fadeInVariants}
        initial="hidden"
        animate={showIntro ? "hidden" : "visible"}
        transition={{ duration: 0.6 }}
      >
        <div className="flex h-screen bg-background text-foreground bottom-gradient">
          <TimelineSidebar
            timeline={timelineEntries}
            isVisible={isSidebarVisible}
            onToggle={toggleSidebar}
          />
          
          <div className={`flex-1 min-w-0 transition-all duration-300 ${isSidebarVisible ? 'ml-96' : 'ml-0'}`}>
            <motion.main
              className="h-full p-6"
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <CandidatesTable 
                filteredCandidates={filteredCandidates} 
                onStartTour={startTour} 
              />
            </motion.main>
          </div>
          <ChatPanel
            setFilteredCandidates={setFilteredCandidates}
            onTimelineUpdate={timelineUpdater}
          />
        </div>
      </motion.div>

      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showTour && componentsLoaded}
        onComplete={completeTour}
        onSkip={skipTour}
      />
    </>
  );
}
