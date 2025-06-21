import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import os from 'os';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file uploaded.' }, { status: 400 });
    }

    // Create a temporary directory for uploads
    const tempDir = path.join(os.tmpdir(), 'uploads');
    await fs.promises.mkdir(tempDir, { recursive: true });
    
    // Create a temporary file path
    const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${audioFile.name}`);

    // Stream the file to the temporary path
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    await fs.promises.writeFile(tempFilePath, buffer);

    // Transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // Clean up the temporary file
    await fs.promises.unlink(tempFilePath);

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio.' }, { status: 500 });
  }
} 