'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type Phase = 'think' | 'act1' | 'act2' | 'speak';
export type PhaseStatus = 'pending' | 'active' | 'completed';

interface PhaseInfo {
  id: Phase;
  title: string;
  description: string;
  icon: string;
  status: PhaseStatus;
  data?: {
    count?: number;
    [key: string]: unknown;
  };
}

interface Props {
  phases: PhaseInfo[];
}

const MCPTimeline: React.FC<Props> = ({ phases }) => {
  if (phases.length === 0) return null;

  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg mb-4">
      {phases.map((phase, index) => (
        <motion.div
          key={`${phase.id}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center
            ${phase.status === 'completed' ? 'bg-green-100 text-green-600' :
              phase.status === 'active' ? 'bg-blue-100 text-blue-600' :
              'bg-gray-100 text-gray-400'}`}
          >
            {phase.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{phase.title}</div>
            <div className="text-xs text-gray-500">{phase.description}</div>
            {phase.status === 'completed' && phase.data?.count && (
              <div className="text-xs text-gray-500">
                Found {phase.data.count} candidates
              </div>
            )}
          </div>
          {phase.status === 'completed' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              ✓
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default MCPTimeline; 