import OpenAI from 'openai';
import { MCPPlans } from '@/app/lib/types';
import { parseJsonResponse } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// THINK phase: Analyze user query and create filter/ranking plans
export async function thinkPhase(userMessage: string): Promise<MCPPlans> {
  const thinkResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a recruitment assistant that analyzes candidate data. 
        Respond ONLY with a valid JSON object, no commentary, no markdown, no code block, no explanation. Do not say anything except the JSON object.
        Format:
        { "filter": { "include": { /* specific filter criteria */ }, "exclude": { /* specific filter criteria */ } }, "rank": { "primary": { "field": "field_name", "direction": "asc"|"desc" } } }
        
        Available candidate fields: id, full_name, title, location, timezone, years_experience, 
        skills, languages, education_level, degree_major, availability_weeks, willing_to_relocate, 
        work_preference, notice_period_weeks, desired_salary_usd, open_to_contract, 
        remote_experience_years, visa_status, citizenships, summary, tags, last_active, linkedin_url
        
        FilterPlan must include specific criteria in the "include" and/or "exclude" objects as appropriate:
        - For "include", specify what should be matched (e.g., must have these skills, must be in these locations).
        - For "exclude", specify what should be excluded (e.g., exclude certain titles, locations, skills, etc.).
        - Both "include" and "exclude" support the following fields:
          - title: array of job titles (e.g., ["Software Engineer", "Developer"])
          - location: array of locations (e.g., ["San Francisco", "New York"])
          - skills: array of skills (e.g., ["JavaScript", "React", "Python"])
          - languages: array of languages (e.g., ["English", "Spanish"])
          - education_level: array of education levels (e.g., ["Bachelor's", "Master's"])
          - work_preference: array of work preferences (e.g., ["Remote", "Hybrid", "On-site"])
          - visa_status: array of visa statuses (e.g., ["US Citizen", "H1B", "Green Card"])
          - tags: array of tags (e.g., ["Senior", "Full-stack", "Frontend"])
          - years_experience_min / years_experience_max: minimum/maximum years of experience (number)
          - desired_salary_min / desired_salary_max: minimum/maximum desired salary (number)
          - availability_weeks_max: maximum availability in weeks (number)
          - notice_period_weeks_max: maximum notice period in weeks (number)
          - willing_to_relocate: boolean (true/false)
          - open_to_contract: boolean (true/false)
        
        IMPORTANT: Always include specific filter criteria in "include" and/or "exclude" based on the user's request. Do not return empty filter objects.
        If the user asks for "all candidates" or doesn't specify criteria, use broad but meaningful filters in "include" like:
        - years_experience_min: 0
        - desired_salary_min: 0
        
        RankingPlan must have: primary: { field, direction: 'asc'|'desc' }
        Common ranking fields: years_experience, desired_salary_usd, last_active
        Optional: tie_breakers: [{ field, direction: 'asc'|'desc' }]`
      },
      {
        role: 'user',
        content: userMessage
      }
    ],
    temperature: 0.1,
  });

  const thinkResult = thinkResponse.choices[0]?.message?.content;
  if (!thinkResult) throw new Error('No response from think phase');

  try {
    const plans = parseJsonResponse(thinkResult);
    console.log('Parsed plans:', JSON.stringify(plans, null, 2));
    
    // Validate that we have meaningful filter criteria
    if (!plans.filter || !plans.filter.include || Object.keys(plans.filter.include).length === 0) {
      console.warn('No filter criteria generated, using default filters');
      plans.filter = {
        include: {
          years_experience_min: 0,
          desired_salary_min: 0
        }
      };
    }
    
    return plans;
  } catch (parseError) {
    console.error('Parse error:', parseError);
    console.error('Raw think result:', thinkResult);
    throw new Error('Invalid JSON response from think phase');
  }
} 