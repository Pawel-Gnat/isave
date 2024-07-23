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

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleAuthStatus }) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-8">
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
                <Input type="email" placeholder="email@poczta.pl" {...field} />
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
        <FormLoadingButton isLoading={loading} text="Utwórz konto" />
      </form>
    </Form>
  );
};

export default RegisterForm;
