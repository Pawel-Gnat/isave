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

interface RegisterFormProps {
  toggleAuthStatus: () => void;
}

const formSchema = z.object({
  company: z.string().trim().min(3, {
    message: 'Company name must be at least 3 characters.',
  }),
  name: z.string().trim().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  surname: z.string().trim().min(2, {
    message: 'Surname must be at least 2 characters.',
  }),
  email: z.string().trim().email(),
  password: z.string().trim().min(2, {
    message: 'Hasło musi mieć przynajmniej 4 znaki.',
  }),
});

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleAuthStatus }) => {
  const [loading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: '',
      name: '',
      surname: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = {
      ...values,
      companyName: capitalizeFirstLetter(values.company),
      name: capitalizeFirstLetter(values.name),
      surname: capitalizeFirstLetter(values.surname),
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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input placeholder="Surname" {...field} />
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
                <Input type="email" placeholder="Email" {...field} />
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
        <LoadingButton isLoading={loading} text="Register" />
      </form>
    </Form>
  );
};

export default RegisterForm;
