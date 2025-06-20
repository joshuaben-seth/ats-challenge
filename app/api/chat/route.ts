import { runMCPWorkflow, createStreamWriter } from '@/app/lib/chat';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];
  console.log('The last message is: ', lastMessage);

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const streamWriter = createStreamWriter(writer);

  runMCPWorkflow(streamWriter, lastMessage.content);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
} 