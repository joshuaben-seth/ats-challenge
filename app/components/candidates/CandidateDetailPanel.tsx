'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, DollarSign, Calendar, CheckSquare, Clock } from 'lucide-react';
import type { Candidate } from '../../lib/types';
import JsonViewer from '../common/JsonViewer';

interface CandidateDetailPanelProps {
  candidate: Candidate | null;
  onClose: () => void;
}

const panelVariants = {
  hidden: { x: '100%' },
  visible: { x: '0%' },
  exit: { x: '100%' },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const DetailItem = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-4 h-4 text-muted-foreground mt-1" />
    <div className="flex-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="text-base text-foreground font-medium">{children}</div>
    </div>
  </div>
);

const CandidateDetailPanel = ({ candidate, onClose }: CandidateDetailPanelProps) => {
  return (
    <AnimatePresence>
      {candidate && (
        <>
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[999]"
            transition={{ duration: 0.3 }}
          />
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-background shadow-2xl z-[1000] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
              <h2 className="text-xl font-bold text-foreground">Candidate Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground rounded-md hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6">
              <div className="space-y-6">
                <JsonViewer title="Raw Candidate Data" jsonData={candidate} defaultOpen />

                <div className="p-4 border border-border rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-bold">
                      {candidate.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{candidate.full_name}</h3>
                      <p className="text-lg text-muted-foreground">{candidate.title}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <DetailItem icon={MapPin} label="Location">{candidate.location}</DetailItem>
                  <DetailItem icon={Clock} label="Timezone">{candidate.timezone}</DetailItem>
                  <DetailItem icon={Briefcase} label="Experience">{candidate.years_experience} years</DetailItem>
                  <DetailItem icon={DollarSign} label="Desired Salary">${candidate.desired_salary_usd.toLocaleString()} USD</DetailItem>
                  <DetailItem icon={Calendar} label="Availability">{candidate.availability_weeks} weeks</DetailItem>
                  <DetailItem icon={CheckSquare} label="Visa Status">{candidate.visa_status}</DetailItem>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2">Summary</h4>
                  <p className="text-foreground/80">{candidate.summary}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CandidateDetailPanel; 