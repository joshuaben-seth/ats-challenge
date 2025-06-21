import OpenAI from 'openai';
import { StreamWriter, Candidate } from '@/app/lib/types';
import { aggregateStats } from '@/app/lib/api';
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
        content: `You are a recruitment assistant. Respond with a very brief, friendly summary of the candidate results.
Format your response as markdown.
Do NOT use a table. 
After the summary, list the top 5 candidates as a simple numbered list, each on its own line, with their name, title, years of experience, and desired salary.
Example format:
###Found [count] candidates.
Avg exp: [avg_experience] yrs | Avg salary: $[avg_salary] | Top skills: [top_skills]
Top 5 candidates:
1. Name (Title) - [Exp] yrs experience, $[Salary]/yr
2. ...
If there are fewer than 5 candidates, list as many as are available.
Always format your response as markdown.`
      },
      {
        role: 'user',
        content: [
          `Found ${stats.count} candidates.`,
          `Avg exp: ${stats.avg_experience} yrs | Avg salary: $${stats.avg_salary.toLocaleString()} | Top skills: ${stats.top_skills.slice(0, 3).join(', ')}`,
          ``,
          `Top 5 candidates:`,
          ``,
          rankedCandidates.slice(0, 5).map((c, i) =>
            `${i + 1}. ${c.full_name} (${c.title}) - ${c.years_experience} yrs, $${c.desired_salary_usd.toLocaleString()}`
          ).join('\n')
        ].join('\n')
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