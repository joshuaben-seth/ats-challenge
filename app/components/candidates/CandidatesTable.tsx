'use client';

import { useEffect, useState, memo } from 'react';
import type { Candidate } from '../../lib/types';
import { motion } from 'framer-motion';
import { Users, Settings, Check, X, SearchX, HelpCircle } from 'lucide-react';

interface CandidatesTableProps {
  filteredCandidates?: Candidate[];
  onStartTour: () => void;
}

const allColumns: { key: keyof Candidate; label: string; width: string; className?: string; sticky?: boolean }[] = [
  { key: 'id', label: 'ID', width: '80px', sticky: true },
  { key: 'full_name', label: 'Name', width: '200px' },
  { key: 'title', label: 'Title', width: '250px' },
  { key: 'work_preference', label: 'Work Pref.', width: '120px', className: 'text-center' },
  { key: 'skills', label: 'Skills', width: '350px' },
  { key: 'location', label: 'Location', width: '200px' },
  { key: 'timezone', label: 'Timezone', width: '150px' },
  { key: 'years_experience', label: 'Exp (yrs)', width: '100px', className: 'text-center' },
  { key: 'languages', label: 'Languages', width: '200px' },
  { key: 'education_level', label: 'Education', width: '150px' },
  { key: 'degree_major', label: 'Major', width: '200px' },
  { key: 'availability_weeks', label: 'Available (wks)', width: '120px', className: 'text-center' },
  { key: 'willing_to_relocate', label: 'Relocate?', width: '100px', className: 'text-center' },
  { key: 'notice_period_weeks', label: 'Notice (wks)', width: '120px', className: 'text-center' },
  { key: 'desired_salary_usd', label: 'Salary (USD)', width: '150px', className: 'text-right' },
  { key: 'open_to_contract', label: 'Contract?', width: '100px', className: 'text-center' },
  { key: 'remote_experience_years', label: 'Remote Exp (yrs)', width: '150px', className: 'text-center' },
  { key: 'visa_status', label: 'Visa Status', width: '150px' },
  { key: 'citizenships', label: 'Citizenships', width: '200px' },
  { key: 'summary', label: 'Summary', width: '400px' },
  { key: 'tags', label: 'Tags', width: '250px' },
  { key: 'last_active', label: 'Last Active', width: '150px' },
  { key: 'linkedin_url', label: 'LinkedIn', width: '100px', className: 'text-center' },
];

// Default visible columns in the specified order
const defaultVisibleColumns: (keyof Candidate)[] = ['id', 'full_name', 'title', 'skills', 'location', 'work_preference'];

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

  const renderCellContent = (candidate: Candidate, columnKey: keyof Candidate) => {
    const value = candidate[columnKey];
    if (value === null || value === undefined) return <span className="text-muted-foreground/50">N/A</span>;

    if (columnKey === 'skills' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((skill) => {
            return (
              <span key={skill} className="px-2 py-0.5 rounded font-medium text-xs bg-muted text-muted-foreground">
                {skill}
              </span>
            );
          })}
        </div>
      );
    }

    if ((columnKey === 'languages' || columnKey === 'tags') && Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((item) => (
            <span key={item} className="px-2 py-0.5 rounded font-medium text-xs bg-muted text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (Array.isArray(value)) return <div className="truncate" title={value.join(', ')}>{value.join(', ')}</div>;
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (columnKey === 'desired_salary_usd' && typeof value === 'number') return `$${value.toLocaleString()}`;
    if (columnKey === 'last_active' && typeof value === 'string') return new Date(value).toLocaleDateString();
    if (columnKey === 'linkedin_url' && typeof value === 'string') {
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View</a>;
    }

    if (columnKey === 'work_preference') {
      const color = {
        Remote: 'bg-blue-500/20 text-blue-400',
        Hybrid: 'bg-purple-500/20 text-purple-400',
        Onsite: 'bg-orange-500/20 text-orange-400',
      }[value as string] || 'bg-secondary';
      return <span className={`px-2 py-1 rounded-full font-medium text-xs ${color}`}>{value}</span>;
    }

    if (columnKey === 'open_to_contract') {
      const color = value ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400';
      return <span className={`px-2 py-1 rounded-full font-medium text-xs ${color}`}>{value ? 'Yes' : 'No'}</span>;
    }

    return <div className="truncate" title={String(value)}>{String(value)}</div>;
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
          
          <div className="divide-y divide-border">
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
              candidatesToDisplay.map((candidate) => (
                <motion.div
                  key={`candidate-${candidate.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
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
              ))
            )}
          </div>
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