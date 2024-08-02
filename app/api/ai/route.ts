import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { isSameDay, startOfToday } from 'date-fns';

import { simplifyCategories } from '@/utils/categoryUtils';
import { capitalizeFirstLetter } from '@/utils/textUtils';

import getExpenseCategories from '@/actions/getExpenseCategories';
import getCurrentUser from '@/actions/getCurrentUser';

interface CompletionResponse {
  date: Date;
  expenses: {
    title: string;
    value: number;
    categoryId: number;
  }[];
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json();
  const { fileText } = body;

  if (!user) {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 403 });
  }

  if (!fileText) {
    return NextResponse.json(
      { error: 'Nie odczytano poprawnie danych' },
      { status: 422 },
    );
  }

  if (process.env.NEXT_ENV !== 'production') {
    return NextResponse.json(
      { error: 'AI niedostępne w trybie testowym' },
      { status: 405 },
    );
  }

  if (!isSameDay(user?.lastApiCall, startOfToday())) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastApiCall: new Date(),
        apiCallLimit: 10,
      },
    });

    user.apiCallLimit = 10;
  }

  if (user.apiCallLimit <= 0) {
    return NextResponse.json(
      { error: 'Dzienny limit AI został wykorzystany' },
      { status: 403 },
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
  });

  const expenseCategories = await getExpenseCategories();
  const simplifiedCategories = simplifyCategories(expenseCategories);

  const MODEL_NAME = 'gpt-4o-mini';
  const SYSTEM_PROMPT = `You are responsible for analyzing the text coming from OCR. Your task is to generate a JSON object of an array of elements compatible with the data type.

  type ExpenseProduct = {
    title: string;
    value: number;
    categoryId: string;
  };

  categoryId match according to the id of the following categories ${JSON.stringify(simplifiedCategories)}.
  Do not create any comments or any additional responses. You have to return only the JSON as 
  {
    expenses: ExpenseProduct[];
  }.
  `;

  async function main() {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fileText },
        ],
        model: MODEL_NAME,
      });

      const content = completion.choices[0].message.content!;
      const response: CompletionResponse = JSON.parse(content);

      const modifiedResponse = {
        expenses: response.expenses.map((expense) => ({
          ...expense,
          title: capitalizeFirstLetter(expense.title),
          id: `${crypto.randomUUID()}`,
        })),
      };

      return NextResponse.json(modifiedResponse);
    } catch (err) {
      if (err instanceof OpenAI.APIError) {
        console.log(err.status, err.name, err.headers);
        return NextResponse.json(
          { error: 'Błąd po stronie modelu językowego' },
          { status: err.status },
        );
      } else {
        console.log(err);
        return NextResponse.json({ error: 'Błąd przetwarzania' }, { status: 422 });
      }
    }
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      apiCallLimit: user.apiCallLimit - 1,
    },
  });

  return main();
}
