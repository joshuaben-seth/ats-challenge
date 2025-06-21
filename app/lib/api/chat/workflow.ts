import { StreamWriter } from '@/app/lib/types';
import { sendPhaseUpdate } from './utils';
import { thinkPhase } from './think';
import { act1Phase } from './act1';
import { act2Phase } from './act2';
import { speakPhase } from './speak';

// Main MCP workflow orchestrator
export async function runMCPWorkflow(writer: StreamWriter, userMessage: string): Promise<void> {
  try {
    // THINK phase
    await sendPhaseUpdate(writer, {
      phase: 'think',
      message: '🤔 Analyzing your question and planning the search...'
    });
    
    const plans = await thinkPhase(userMessage);
    
    // Send the plans
    await sendPhaseUpdate(writer, {
      phase: 'think',
      data: { 
        filterPlan: plans.filter,
        rankingPlan: plans.rank
      }
    });
    
    // ACT 1 phase
    const filteredCandidates = await act1Phase(writer, plans.filter);
    
    // ACT 2 phase
    const rankedCandidates = await act2Phase(writer, filteredCandidates, plans.rank);
    
    // SPEAK phase
    await speakPhase(writer, userMessage, rankedCandidates);
    
  } catch (error) {
    console.error('Error in MCP workflow:', error);
    await sendPhaseUpdate(writer, {
      phase: 'error',
      message: 'Sorry, there was an error processing your request. Please try again.'
    });
  } finally {
    await writer.close();
  }
} 