'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  
  X, 
  ChevronRight, 
  ChevronLeft,
  HelpCircle
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  offset?: { x: number; y: number };
}

const tourSteps: TourStep[] = [
  {
    id: 'chat-input',
    title: 'Your Recruitment Wand',
    description: 'This is where the magic happens! Tell me who you\'re looking for in plain English. For example, "Find me a software wizard in Wonderland" or "Show me all the unicorn designers available".',
    target: '[data-tour="chat-input"]',
    position: 'top',
    offset: { x: 0, y: -20 }
  },
  {
    id: 'chat-controls',
    title: 'Tidy Up Your Workspace',
    description: 'Feel free to move this chat window around with the drag handle, or tuck it away with the minimize button. Your workspace should be as comfy as your favorite chair!',
    target: '[data-tour="chat-controls"]',
    position: 'left',
    offset: { x: -20, y: 0 }
  },
  {
    id: 'timeline-controls',
    title: 'See My Secret Notes!',
    description: 'Ever wonder how I find the perfect candidates? Click here to peek behind the curtain! This panel shows you my step-by-step process for every search you make.',
    target: '[data-tour*="timeline-"]',
    position: 'right',
    offset: { x: 20, y: 0 }
  },
  {
    id: 'field-selector',
    title: 'Design Your Dashboard',
    description: 'You\'re in the director\'s chair! Click here to pick and choose exactly what you want to see. Want to see skills but not salary? No problem. Customize the view to your heart\'s content.',
    target: '[data-tour="field-selector"]',
    position: 'bottom',
    offset: { x: 0, y: 20 }
  }
];

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ isVisible, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [highlightPosition, setHighlightPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      setOverlayVisible(true);
      setCurrentStep(0);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setOverlayVisible(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible && overlayVisible) {
      updatePositions();
    }
  }, [currentStep, isVisible, overlayVisible]);

  useEffect(() => {
    const handleResize = () => {
      if (isVisible && overlayVisible) {
        updatePositions();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isVisible, overlayVisible]);

  const updatePositions = () => {
    const currentTourStep = tourSteps[currentStep];
    const targetElement = document.querySelector(currentTourStep.target) as HTMLElement;
    const tooltipElement = stepRef.current;
    
    if (targetElement && tooltipElement) {
      const targetRect = targetElement.getBoundingClientRect();
      const tooltipRect = tooltipElement.getBoundingClientRect();
      const offset = currentTourStep.offset || { x: 0, y: 0 };
      
      // Set highlight position
      setHighlightPosition({
        x: targetRect.left - 8,
        y: targetRect.top - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16
      });

      // Calculate tooltip position based on step position preference
      let tooltipX = 0;
      let tooltipY = 0;

      switch (currentTourStep.position) {
        case 'top':
          tooltipX = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          tooltipY = targetRect.top - tooltipRect.height;
          break;
        case 'bottom':
          tooltipX = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
          tooltipY = targetRect.bottom;
          break;
        case 'left':
          tooltipX = targetRect.left - tooltipRect.width;
          tooltipY = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          break;
        case 'right':
          tooltipX = targetRect.right;
          tooltipY = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
          break;
      }

      // Apply offset
      tooltipX += offset.x;
      tooltipY += offset.y;

      // Ensure tooltip stays within viewport
      const margin = 20;
      if (tooltipX < margin) tooltipX = margin;
      if (tooltipX + tooltipRect.width > window.innerWidth - margin) {
        tooltipX = window.innerWidth - tooltipRect.width - margin;
      }
      if (tooltipY < margin) tooltipY = margin;
      if (tooltipY + tooltipRect.height > window.innerHeight - margin) {
        tooltipY = window.innerHeight - tooltipRect.height - margin;
      }

      setTooltipPosition({ x: tooltipX, y: tooltipY });
    } else {
      // If target element or tooltip is not found, try again after a short delay
      setTimeout(() => {
        updatePositions();
      }, 100);
    }
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  if (!isVisible || !overlayVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" />
        
        {/* Highlighted Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute pointer-events-none border-2 border-primary rounded-lg shadow-lg"
          style={{
            left: highlightPosition.x,
            top: highlightPosition.y,
            width: highlightPosition.width,
            height: highlightPosition.height,
            zIndex: 102,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          }}
        />
        
        {/* Tour Tooltip */}
        <motion.div
          ref={stepRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute pointer-events-auto"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            zIndex: 103
          }}
        >
          <div className="bg-card border border-border rounded-lg shadow-2xl max-w-sm w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Welcome to the Tour!</h3>
              </div>
              <button
                onClick={onSkip}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="font-medium text-foreground mb-2">{currentTourStep.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{currentTourStep.description}</p>
              
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {currentStep + 1} of {tourSteps.length}
                </span>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 