'use client';

import { useState } from 'react';
import { ChevronDown, FileJson } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JsonViewerProps {
  title: string;
  jsonData: object;
}

const formatJSON = (json: object) => {
  try {
    return JSON.stringify(json, null, 2);
  } catch {
    return String(json);
  }
};

export default function JsonViewer({ title, jsonData }: JsonViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-xs mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground w-full text-left"
      >
        <FileJson className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium flex-grow">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <pre className="text-xs bg-black/50 p-3 mt-2 rounded border border-border overflow-x-auto text-foreground font-mono">
              {formatJSON(jsonData)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 