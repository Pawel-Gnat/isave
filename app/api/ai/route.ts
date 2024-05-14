import { NextResponse } from 'next/server';
import OpenAI from 'openai';

import { expenseCategories } from '@/lib/transactionCategories';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

type ExpenseProduct = {
  name: string;
  value: number;
  categoryId: string;
};

const simplifyCategories = (categories) => {
  return categories.map(({ id, name }) => ({ id, name }));
};
const simplifiedCategories = simplifyCategories(expenseCategories);

// import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { data } = body;

  const MODEL_NAME = 'gpt-3.5-turbo';
  const SYSTEM_PROMPT = `You are responsible for analyzing the text coming from OCR. Your task is to generate a JSON object of an array of elements compatible with the data type. 
  type ExpenseProduct = {
    name: string;
    value: number;
    categoryId: number;
  };

  [
    data: Date,
    expenses: ExpenseProduct[],
  ]
  
  categoryId match according to the id of the following categories ${JSON.stringify(simplifiedCategories)}. 
  Do not create any comments or any additional responses. You have to return only the JSON.

  Text from OCR below.
  ${data}
  `;

  // async function main() {
  //   const stream = await openai.chat.completions.create({
  //     model: MODEL_NAME,
  //     messages: [{ role: 'user', content: 'Say this is a test' }],
  //     stream: true,
  //   });
  //   for await (const chunk of stream) {
  //     process.stdout.write(chunk.choices[0]?.delta?.content || '');
  //   }
  // }

  // main();

  console.log(SYSTEM_PROMPT);

  const response = {
    date: '2022-10-22',
    expenses: [
      { name: 'MAPUSTA KNASZONA 0, 9kg', value: 148.98, categoryId: 4 },
      { name: 'OGORK KMASZONE 8706 FRUBEX', value: 147.99, categoryId: 4 },
      { name: 'DGORKI KWASZONE 8706 FRUBEX', value: 147.99, categoryId: 4 },
      { name: 'Masi 4009', value: 11.99, categoryId: 9 },
      { name: 'Delicje Poraranczowe 1476', value: 123.28, categoryId: 7 },
      { name: 'Jajka 7 wolnego wybiegu', value: 0, categoryId: 1 },
      { name: 'Pottidor Mal./Zuykty/Bawole Serce', value: 2.1, categoryId: 2 },
      { name: 'Sezanki 2 nioden unitop-opting', value: 0, categoryId: 7 },
      { name: 'CILER 600g', value: 15.09, categoryId: 7 },
    ],
  };

  return NextResponse.json(response);
}
