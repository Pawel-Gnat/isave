import { http, HttpResponse } from 'msw';

export const watchAI = [
  http.post('/api/ai', async () => {
    return HttpResponse.json({
      expenses: [
        {
          title: 'Zakupy',
          value: 31.21,
          categoryId: '664e350ee6313cde67661e74',
          id: '8db6ef1c-323f-46ef-8fcc-bb7d56a020ce',
        },
      ],
    });
  }),
];
