import type { Candidate, TimelineEntry, TimelineEntryPhase } from '@/app/lib/types';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type StreamCallbacks = {
  onTimelineUpdate: (updater: (prev: TimelineEntry[]) => TimelineEntry[]) => void;
  onCandidatesFound: (candidates: Candidate[]) => void;
  onSummaryChunk: (chunk: string) => void;
  onStreamEnd: (data: { duration: number }) => void;
  onError: () => void;
};

const getPhaseTitle = (phase: string) => {
  switch (phase) {
    case 'think': return 'Analysis';
    case 'act1': return 'Filtering';
    case 'act2': return 'Ranking';
    case 'speak': return 'Summary';
    default: return 'Unknown Phase';
  }
};

const getPhaseDescription = (phase: string) => {
  switch (phase) {
    case 'think': return 'Understanding your requirements';
    case 'act1': return 'Finding matching candidates';
    case 'act2': return 'Sorting by relevance';
    case 'speak': return 'Generating insights';
    default: return 'Processing...';
  }
};

export async function processChatStream(
  messages: Message[],
  queryId: string,
  callbacks: StreamCallbacks
) {
  const startTime = Date.now();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok || !response.body) throw new Error('Request failed');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let act2Candidates: Candidate[] | undefined = undefined;
    let candidatesFinalized = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const mcpResponse = JSON.parse(line);
          if (mcpResponse.phase === 'error') throw new Error('API error');
          
          callbacks.onTimelineUpdate(prev => {
            const queryIndex = prev.slice().reverse().findIndex(entry => entry.id === queryId);
            const currentQueryEntries = queryIndex !== -1 ? prev.slice(prev.length - 1 - queryIndex) : [];

            const existingEntry = currentQueryEntries.find(
              entry => entry.type === 'phase' && entry.phase === mcpResponse.phase
            ) as TimelineEntryPhase | undefined;
            
            if (existingEntry) {
              return prev.map(entry =>
                entry.id === existingEntry.id && entry.type === 'phase'
                  ? { ...entry, data: { ...entry.data, ...mcpResponse.data } }
                  : entry
              );
            }
            const newEntry: TimelineEntry = {
              type: 'phase',
              id: `${mcpResponse.phase}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              phase: mcpResponse.phase,
              title: getPhaseTitle(mcpResponse.phase),
              description: getPhaseDescription(mcpResponse.phase),
              timestamp: new Date(),
              data: mcpResponse.data,
            };
            return [...prev, newEntry];
          });

          if (mcpResponse.phase === 'act2' && mcpResponse.data?.topCandidates) {
            act2Candidates = mcpResponse.data.topCandidates as Candidate[];
          }
          
          if (mcpResponse.phase === 'speak') {
            if (act2Candidates && !candidatesFinalized) {
              callbacks.onCandidatesFound(act2Candidates);
              candidatesFinalized = true;
            }
            if (mcpResponse.data?.content) {
              callbacks.onSummaryChunk(mcpResponse.data.content);
            }
          }
        } catch (e) {
          console.error('Error parsing stream line:', e);
        }
      }
    }
  } catch (error) {
    console.error('Chat stream processing error:', error);
    callbacks.onError();
  } finally {
    const endTime = Date.now();
    callbacks.onStreamEnd({ duration: (endTime - startTime) / 1000 });
  }
} 