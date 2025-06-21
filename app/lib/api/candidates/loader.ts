import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { Candidate } from '@/app/lib/types';

let candidatesCache: Candidate[] | null = null;

function parseBoolean(val: string) {
  return val && val.trim().toLowerCase() === 'yes';
}

function parseArray(val: string) {
  return val ? val.split(';').map(s => s.trim()) : [];
}

function parseNumber(val: string) {
  return Number(val) || 0;
}

export function loadCandidates(): Candidate[] {
  if (candidatesCache) return candidatesCache;

  const csvPath = path.join(process.cwd(), 'candidates.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const candidates: Candidate[] = records.map((row: Record<string, string>) => ({
    id: row.id,
    full_name: row.full_name,
    title: row.title,
    location: row.location,
    timezone: row.timezone,
    years_experience: parseNumber(row.years_experience),
    skills: parseArray(row.skills),
    languages: parseArray(row.languages),
    education_level: row.education_level,
    degree_major: row.degree_major,
    availability_weeks: parseNumber(row.availability_weeks),
    willing_to_relocate: parseBoolean(row.willing_to_relocate),
    work_preference: row.work_preference,
    notice_period_weeks: parseNumber(row.notice_period_weeks),
    desired_salary_usd: parseNumber(row.desired_salary_usd),
    open_to_contract: parseBoolean(row.open_to_contract),
    remote_experience_years: parseNumber(row.remote_experience_years),
    visa_status: row.visa_status,
    citizenships: parseArray(row.citizenships),
    summary: row.summary,
    tags: parseArray(row.tags),
    last_active: row.last_active,
    linkedin_url: row.linkedin_url,
  }));

  candidatesCache = candidates;
  return candidates;
} 