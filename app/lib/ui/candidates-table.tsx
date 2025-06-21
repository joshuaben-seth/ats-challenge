'use client';

import type { Candidate } from '../types';
import type { Variants } from 'framer-motion';
import Badge from '../../components/candidates/Badge';

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
        {(value as string[]).map((skill) => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </div>
    );
  }

  if ((columnKey === 'languages' || columnKey === 'tags') && Array.isArray(value) && value.length > 0) {
    return (
      <div className="flex flex-wrap gap-1">
        {(value as string[]).map((item) => (
          <Badge key={item}>{item}</Badge>
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
    const variant = {
      Remote: 'primary',
      Hybrid: 'secondary',
      Onsite: 'warning',
    }[value as string] as 'primary' | 'secondary' | 'warning' | undefined;
    return <Badge variant={variant} className="py-1">{value}</Badge>;
  }

  if (columnKey === 'open_to_contract') {
    return <Badge variant={value ? 'success' : 'danger'} className="py-1">{value ? 'Yes' : 'No'}</Badge>;
  }

  return <div className="truncate" title={String(value)}>{String(value)}</div>;
}; 