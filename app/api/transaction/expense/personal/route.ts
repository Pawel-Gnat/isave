import { NextResponse } from 'next/server';

// import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { date, expenses } = body;

  return NextResponse.json({ date, expenses });
}
