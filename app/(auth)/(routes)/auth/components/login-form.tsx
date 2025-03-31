import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { captureException } from '@sentry/nextjs';

import { LoginFormSchema } from '@/utils/formValidations';
import { logError } from '@/utils/errorUtils';

import { signIn } from 'next-auth/react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FormLoadingButton } from '@/components/shared/form-loading-button';
import { LOGIN_REDIRECT } from '@/routes';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onLogin(values: z.infer<typeof LoginFormSchema>) {
    if (loading) return;

    try {
      setIsLoading(true);
      const { email, password } = values;

      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('@@@', result);

      if (result?.error) {
        toast.warning(`${result.error}`);
      } else {
        router.push(LOGIN_REDIRECT);
        toast.success('Pomyślnie zalogowano');
      }
    } catch (error) {
      console.log(error);
      toast.error('Błąd logowania');
      logError(() => captureException(`Sign in - logging in failed: ${error}`), error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onLogin)}
        className="flex flex-col gap-4 [&>*:last-child]:mt-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasło</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="*****"
                  {...field}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLoadingButton isLoading={loading} text="Zaloguj się" />
      </form>
    </Form>
  );
};

export default LoginForm;
