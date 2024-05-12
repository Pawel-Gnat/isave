import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});
const MODEL_NAME = 'gpt-3.5-turbo';
const SYSTEM_PROMPT = 'You are a helpful assistant.';

// import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  // const { name, email, password } = body;
  console.log(body);

  // async function main() {
  //   const stream = await openai.chat.completions.create({
  //     model: MODEL_Name,
  //     messages: [{ role: 'user', content: 'Say this is a test' }],
  //     stream: true,
  //   });
  //   for await (const chunk of stream) {
  //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
  //   }
  // }

  // main();

  return NextResponse.json('ok');
}
