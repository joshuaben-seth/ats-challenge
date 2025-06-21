'use client';

import type { Candidate } from '../types';
import type { Variants } from 'framer-motion';

export interface CandidatesTableProps {
  filteredCandidates?: Candidate[];
  onStartTour: () => void;
}

export const allColumns: { key: keyof Candidate; label: string; width: string; className?: string; sticky?: boolean }[] = [
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
export const defaultVisibleColumns: (keyof Candidate)[] = ['id', 'full_name', 'title', 'skills', 'location', 'work_preference'];

export const tableContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      ease: 'easeIn',
      duration: 0.3
    }
  },
};

export const renderCellContent = (candidate: Candidate, columnKey: keyof Candidate) => {
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