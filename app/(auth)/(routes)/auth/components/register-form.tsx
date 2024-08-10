import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { RegisterFormSchema } from '@/utils/formValidations';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { FormLoadingButton } from '@/components/shared/form-loading-button';

interface RegisterFormProps {
  toggleAuthStatus: () => void;
}

const RegisterForm = ({ toggleAuthStatus }: RegisterFormProps) => {
  const [loading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    if (loading) return;
    setIsLoading(true);

    axios
      .post('/api/register', values)
      .then((response) => {
        toast.success(`${response.data}`);
        toggleAuthStatus();
      })
      .catch((error) => {
        toast.warning(`${error.response.data.error}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 [&>*:last-child]:mt-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder="Imię" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@address.pl" {...field} />
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
                <Input type="password" placeholder="*****" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormDescription>
          Po utworzeniu konta wysyłany jest link aktywacyjny na podany adres email.
        </FormDescription>
        <FormLoadingButton isLoading={loading} text="Utwórz konto" />
      </form>
    </Form>
  );
};

export default RegisterForm;
