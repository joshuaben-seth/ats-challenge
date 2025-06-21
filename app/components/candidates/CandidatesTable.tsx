'use client';

import { useEffect, useState, memo, useCallback } from 'react';
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
import { LoadingDots, EmptyState, Card, Button } from '../../lib/ui/components';
import { ERROR_MESSAGES } from '../../lib/utils/constants';
import CandidateDetailPanel from './CandidateDetailPanel';

const CandidateRow = memo(
  ({
    candidate,
    columns,
    gridTemplateColumns,
    onSelect,
  }: {
    candidate: Candidate;
    columns: typeof allColumns;
    gridTemplateColumns: string;
    onSelect: (candidate: Candidate) => void;
  }) => {
    return (
      <motion.div
        layoutId={`candidate-${candidate.id}`}
        className="group grid items-stretch border-b border-border/50 text-sm text-foreground transition-colors duration-150 hover:bg-secondary/50 cursor-pointer"
        style={{ gridTemplateColumns }}
        variants={rowVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={() => onSelect(candidate)}
      >
        {columns.map(col => (
          <div
            key={`${candidate.id}-${col.key}`}
            className={`py-3 px-4 text-left overflow-hidden text-ellipsis whitespace-nowrap ${
              col.className || ''
            } ${
              col.sticky
                ? 'sticky top-0 left-0 z-10 bg-background group-hover:bg-secondary/50 border-r border-border'
                : ''
            }`}
          >
            {renderCellContent(candidate, col.key)}
          </div>
        ))}
      </motion.div>
    );
  }
);
CandidateRow.displayName = 'CandidateRow';

const CandidatesTable = ({ filteredCandidates, onStartTour }: CandidatesTableProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<(keyof Candidate)[]>(defaultVisibleColumns);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const onSelectCandidate = useCallback((candidate: Candidate) => {
    setSelectedCandidate(candidate);
  }, []);

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
        setError(err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR);
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
    return (
      <EmptyState
        icon={<SearchX className="h-12 w-12" />}
        title="Error Loading Candidates"
        description={error}
      />
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-border flex-shrink-0 bg-background">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md border border-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">{candidatesToDisplay.length} candidates</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="secondary"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                data-tour="field-selector"
              >
                <Settings className="w-4 h-4" />
                Fields ({visibleColumns.length})
              </Button>
              
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
            
            <Button variant="icon" onClick={onStartTour}>
              <HelpCircle className="w-4 h-4" />
            </Button>
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
                  <LoadingDots className="text-muted-foreground" />
                  <span className="ml-2">Loading candidates...</span>
                </div>
              ) : candidatesToDisplay.length === 0 ? (
                <EmptyState
                  icon={<SearchX className="h-12 w-12" />}
                  title={
                    filteredCandidates !== undefined
                      ? "No candidates match the criteria"
                      : "No candidates in the database"
                  }
                  description={
                    filteredCandidates !== undefined
                      ? "Try adjusting your search filters to find what you're looking for."
                      : "As soon as you add candidates, they will be listed here."
                  }
                />
              ) : (
                <AnimatePresence>
                  {candidatesToDisplay.map(candidate => (
                    <CandidateRow
                      key={candidate.id}
                      candidate={candidate}
                      columns={columns}
                      gridTemplateColumns={gridTemplateColumns}
                      onSelect={onSelectCandidate}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </div>
        </div>
      </Card>

      {/* Candidate Detail Panel */}
      <CandidateDetailPanel
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  );
};

export default memo(CandidatesTable); 