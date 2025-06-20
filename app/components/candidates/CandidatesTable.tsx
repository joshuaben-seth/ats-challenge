'use client';

import { useEffect, useState, memo } from 'react';
import type { Candidate } from '../../lib/types';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface CandidatesTableProps {
  filteredCandidates?: Candidate[];
}

const skillBadgeColors = [
  'bg-sky-500/20 text-sky-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-amber-500/20 text-amber-400',
  'bg-rose-500/20 text-rose-400',
  'bg-indigo-500/20 text-indigo-400',
  'bg-teal-500/20 text-teal-400',
];

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const columns: { key: keyof Candidate; label: string; width: string; className?: string }[] = [
  { key: 'id', label: 'ID', width: '80px' },
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

const gridTemplateColumns = columns.map(c => c.width).join(' ');

const CandidatesTable = ({ filteredCandidates }: CandidatesTableProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [error, setError] = useState<string | null>(null);

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
      }
    }
    fetchCandidates();
  }, []);

  const candidatesToDisplay = filteredCandidates ?? candidates;

  const renderCellContent = (candidate: Candidate, columnKey: keyof Candidate) => {
    const value = candidate[columnKey];
    if (value === null || value === undefined) return <span className="text-muted-foreground/50">N/A</span>;

    if (columnKey === 'skills' && Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[]).map((skill) => {
            const color = skillBadgeColors[hashCode(skill) % skillBadgeColors.length];
            return (
              <span key={skill} className={`px-2 py-0.5 rounded font-medium text-xs ${color}`}>
                {skill}
              </span>
            );
          })}
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
      <div className="flex-grow overflow-auto">
        <div
          className="p-4 flex items-center justify-between border-b border-border flex-shrink-0 sticky top-0 bg-card z-20"
          style={{ minWidth: gridTemplateColumns }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md border border-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Candidates</h2>
          </div>
          <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
            {candidatesToDisplay.length} results
          </span>
        </div>

        <div className="relative">
          <div
            className="grid text-sm text-muted-foreground font-medium border-b border-border bg-secondary/50 sticky top-[73px] z-10"
            style={{ gridTemplateColumns }}
          >
            {columns.map(col => (
              <div key={col.key} className={`py-3 px-4 ${col.className || ''}`}>{col.label}</div>
            ))}
          </div>
          
          <div className="divide-y divide-border">
            {candidatesToDisplay.map((candidate) => (
              <motion.div
                key={candidate.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid items-start hover:bg-secondary/50 transition-colors"
                style={{ gridTemplateColumns }}
              >
                {columns.map(col => (
                  <div key={col.key} className={`text-sm px-4 py-3 ${col.className || ''}`}>
                    {renderCellContent(candidate, col.key)}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CandidatesTable); 