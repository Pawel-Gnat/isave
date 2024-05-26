import * as z from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().trim().email({ message: 'Zweryfikuj adres email.' }),
  password: z.string().trim().min(1, {
    message: 'Wpisz hasło do konta.',
  }),
});

export const RegisterFormSchema = z.object({
  name: z.string().trim().min(2, {
    message: 'Imię musi mieć przynajmniej 2 znaki.',
  }),
  email: z.string().trim().email({ message: 'Zweryfikuj adres email.' }),
  password: z.string().trim().min(2, {
    message: 'Hasło musi mieć przynajmniej 4 znaki.',
  }),
});
