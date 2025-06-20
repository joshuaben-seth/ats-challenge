import OpenAI from 'openai';
import { StreamWriter, Candidate } from '@/app/lib/types';
import { aggregateStats } from '@/app/lib/candidates';
import { sendPhaseUpdate } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function speakPhase(writer: StreamWriter, userMessage: string, rankedCandidates: Candidate[]): Promise<void> {
  await sendPhaseUpdate(writer, {
    phase: 'speak',
    message: '💬 Generating your personalized summary...'
  });

  const stats = aggregateStats(rankedCandidates);
  const speakResponse = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are a helpful recruitment assistant. Provide a concise, friendly summary of the candidate search results. 
        Include key insights about the candidates found, their experience levels, salary expectations, and any notable patterns.
        Keep it conversational and actionable for a recruiter.`
      },
      {
        role: 'user',
        content: `Original question: "${userMessage}"
        
        Found ${stats.count} candidates. Top 5 candidates:
        ${rankedCandidates.slice(0, 5).map((c, i) => `${i + 1}. ${c.full_name} - ${c.title} (${c.years_experience} years exp, $${c.desired_salary_usd.toLocaleString()})`).join('\n')}
        
        Summary stats:
        - Average experience: ${stats.avg_experience} years
        - Average salary: $${stats.avg_salary.toLocaleString()}
        - Top skills: ${stats.top_skills.slice(0, 5).join(', ')}
        - Locations: ${stats.locations.slice(0, 3).join(', ')}
        
        Provide a helpful summary for the recruiter.`
      }
    ],
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of speakResponse) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      await sendPhaseUpdate(writer, {
        phase: 'speak',
        data: { content }
      });
    }
  }
} 