import * as z from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: 'Zweryfikuj adres email' }),
  password: z.string().trim().min(1, {
    message: 'Wpisz hasło do konta',
  }),
});

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: 'Imię musi mieć przynajmniej 3 znaki',
    })
    .max(20, {
      message: 'Imię może mieć maksymalnie 20 znaków',
    }),
  email: z.string().trim().email({ message: 'Zweryfikuj adres email' }),
  password: z.string().trim().min(2, {
    message: 'Hasło musi mieć przynajmniej 4 znaki',
  }),
});

export const CreateBudgetFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: 'Nazwa musi mieć przynajmniej 3 znaki',
    })
    .max(20, {
      message: 'Nazwa może mieć maksymalnie 20 znaków',
    }),
});

export const HandleMemberFormSchema = z.object({
  inviteId: z.string().trim().min(1, {
    message: 'Uzupełnij pole numerem ID',
  }),
});

export const TransactionSchema = z.object({
  date: z.date(),
  transactions: z.array(
    z.object({
      id: z.string(),
      title: z.string().trim().min(1),
      value: z.number().min(0.01),
      categoryId: z.string().trim().min(1),
    }),
  ),
});
