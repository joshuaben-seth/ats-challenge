import { StreamWriter, PhaseData, MCPPlans } from '@/app/lib/types';

export async function sendPhaseUpdate(writer: StreamWriter, phaseData: PhaseData) {
  await writer.write(JSON.stringify(phaseData) + '\n');
}

export function parseJsonResponse(response: string): MCPPlans {
  let cleanedResponse = response.trim();
  if (cleanedResponse.startsWith('```json')) {
    cleanedResponse = cleanedResponse.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleanedResponse.startsWith('```')) {
    cleanedResponse = cleanedResponse.replace(/^```/, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleanedResponse);
}

export function createStreamWriter(writer: WritableStreamDefaultWriter<Uint8Array>): StreamWriter {
  const encoder = new TextEncoder();
  return {
    write: async (data: string) => {
      await writer.write(encoder.encode(data));
    },
    close: async () => {
      await writer.close();
    }
  };
} 