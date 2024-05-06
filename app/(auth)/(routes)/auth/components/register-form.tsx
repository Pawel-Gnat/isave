import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import capitalizeFirstLetter from '@/utils/capitalizeFirstLetter';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { LoadingButton } from '@/components/shared/loading-button';

import { RegisterFormSchema } from '@/utils/validations';

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
    const formData = {
      ...values,
      name: capitalizeFirstLetter(values.name),
    };

    if (loading) return;
    setIsLoading(true);

    axios
      .post('/api/register', formData)
      .then((response) => {
        toast(`${response.data}`);
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
        <LoadingButton isLoading={loading} text="Utwórz konto" />
      </form>
    </Form>
  );
};

export default RegisterForm;
