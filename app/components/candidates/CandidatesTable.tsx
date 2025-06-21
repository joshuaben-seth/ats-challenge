'use client';

import { useEffect, useState, memo } from 'react';
import type { Candidate } from '../../lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Settings, Check, X, SearchX, HelpCircle } from 'lucide-react';
import { 
  allColumns, 
  defaultVisibleColumns, 
  tableContainerVariants, 
  rowVariants, 
  renderCellContent,
  type CandidatesTableProps
} from '../../lib/ui';

const CandidatesTable = ({ filteredCandidates, onStartTour }: CandidatesTableProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<(keyof Candidate)[]>(defaultVisibleColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await fetch('/api/candidates');
        if (!response.ok) {
          throw new Error('Failed to fetch candidates');
        }
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const candidatesToDisplay = filteredCandidates ?? candidates;

  // Filter columns based on visibility
  const columns = allColumns.filter(col => visibleColumns.includes(col.key));
  const gridTemplateColumns = columns.map(c => c.width).join(' ');
  const tableWidth = columns.map(c => parseInt(c.width, 10)).reduce((acc, w) => acc + w, 0);

  const toggleColumn = (columnKey: keyof Candidate) => {
    if (columnKey === 'id') return; // ID column cannot be hidden
    
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-border flex-shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md border border-primary/20">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{candidatesToDisplay.length} candidates</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Column Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors border border-border"
              data-tour="field-selector"
            >
              <Settings className="w-4 h-4" />
              Fields ({visibleColumns.length})
            </button>
            
            {/* Column Selector Popover */}
            {showColumnSelector && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-[60]">
                <div className="p-3 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">Visible Fields</h3>
                  <p className="text-xs text-muted-foreground mt-1">Select which fields to display</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {allColumns.map(col => (
                    <div
                      key={col.key}
                      className={`flex items-center justify-between px-3 py-2 hover:bg-secondary/50 cursor-pointer ${
                        col.key === 'id' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => toggleColumn(col.key)}
                    >
                      <span className="text-sm text-foreground">{col.label}</span>
                      <div className="flex items-center gap-2">
                        {visibleColumns.includes(col.key) ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <button
                    onClick={() => setVisibleColumns(defaultVisibleColumns)}
                    className="text-xs text-primary hover:underline"
                  >
                    Reset to default
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onStartTour}
            className="p-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors border border-border"
            title="Start guided tour"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="w-full min-w-max">
          <div
            className="grid items-stretch text-sm text-muted-foreground font-medium border-b border-border bg-background sticky top-0 z-20"
            style={{ gridTemplateColumns }}
          >
            {columns.map(col => (
              <div 
                key={col.key} 
                className={`py-3 px-4 ${col.className || ''} ${col.sticky ? 'sticky top-0 left-0 z-30 bg-background border-r border-border' : ''}`}
              >
                {col.label}
              </div>
            ))}
          </div>
          
          <motion.div
            className="divide-y divide-border"
            variants={tableContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-16">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2">Loading candidates...</span>
                </div>
              </div>
            ) : candidatesToDisplay.length === 0 ? (
              <div className="text-center p-16">
                <SearchX className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {filteredCandidates !== undefined
                    ? "No candidates match the criteria"
                    : "No candidates in the database"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filteredCandidates !== undefined
                    ? "Try adjusting your search filters to find what you're looking for."
                    : "As soon as you add candidates, they will be listed here."}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {candidatesToDisplay.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    layout="position"
                    variants={rowVariants}
                    exit="exit"
                    className="grid items-stretch group"
                    style={{ gridTemplateColumns }}
                  >
                    {columns.map(col => (
                      <div 
                        key={col.key} 
                        className={`text-sm px-4 py-3 transition-colors group-hover:bg-secondary/50 ${col.className || ''} ${col.sticky ? 'sticky left-0 z-10 bg-card border-r border-border' : ''}`}
                      >
                        {renderCellContent(candidate, col.key)}
                      </div>
                    ))}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Click outside to close popover */}
      {showColumnSelector && (
        <div 
          className="fixed inset-0 z-[55]" 
          onClick={() => setShowColumnSelector(false)}
        />
      )}
    </div>
  );
};

export default memo(CandidatesTable); 