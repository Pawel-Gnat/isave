import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// import { expenseCategories } from '@/lib/transactionCategories';

import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

type ExpenseProduct = {
  title: string;
  value: number;
  categoryId: string;
};

// const simplifyCategories = (categories) => {
//   return categories.map(({ id, title }) => ({ id, title }));
// };
// const simplifiedCategories = simplifyCategories(expenseCategories);

// import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { data } = body;

  const MODEL_NAME = 'gpt-3.5-turbo';
  // const SYSTEM_PROMPT = `You are responsible for analyzing the text coming from OCR. Your task is to generate a JSON object of an array of elements compatible with the data type.
  // type ExpenseProduct = {
  //   title: string;
  //   value: number;
  //   categoryId: number;
  // };

  // {
  //   data: Date,
  //   expenses: ExpenseProduct[],
  // }

  // categoryId match according to the id of the following categories ${JSON.stringify(simplifiedCategories)}.
  // Do not create any comments or any additional responses. You have to return only the JSON.

  // Text from OCR below.
  // ${data}
  // `;

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

  // console.log(SYSTEM_PROMPT);

  const response = {
    date: '2024-05-10',
    expenses: [
      {
        id: `${crypto.randomUUID()}`,
        title: 'MAPUSTA KNASZONA 0, 9kg',
        value: 148.98,
        categoryId: '4',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'OGORK KMASZONE 8706 FRUBEX',
        value: 147.99,
        categoryId: '4',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'DGORKI KWASZONE 8706 FRUBEX',
        value: 147.99,
        categoryId: '4',
      },
      { id: `${crypto.randomUUID()}`, title: 'Masi 4009', value: 11.99, categoryId: '9' },
      {
        id: `${crypto.randomUUID()}`,
        title: 'Delicje Poraranczowe 1476',
        value: 123.28,
        categoryId: '7',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'Jajka 7 wolnego wybiegu',
        value: 0,
        categoryId: '1',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'Pottidor Mal./Zuykty/Bawole Serce',
        value: 2.1,
        categoryId: '2',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'Sezanki 2 nioden unitop-opting',
        value: 0,
        categoryId: '7',
      },
      {
        id: `${crypto.randomUUID()}`,
        title: 'CILER 600g',
        value: 15.09,
        categoryId: '7',
      },
    ],
  };

  const modifiedResponse = {
    date: response.date,
    expenses: response.expenses.map((expense) => ({
      ...expense,
      title: capitalizeFirstLetter(expense.title),
    })),
  };

  return NextResponse.json(modifiedResponse);
}
