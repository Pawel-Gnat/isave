import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { toast } from 'sonner';

import { CreateBudgetFormSchema } from '@/utils/formValidations';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Dialog } from '@/components/dialog/dialog';
import { logError } from '@/utils/errorUtils';
import { captureException } from '@sentry/nextjs';
import { useQueryClient } from '@tanstack/react-query';

interface NewBudgetModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const NewBudgetModal = ({ isOpen, setIsOpen }: NewBudgetModalProps) => {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof CreateBudgetFormSchema>>({
    resolver: zodResolver(CreateBudgetFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
  };

  const submitNewBudget = async (data: z.infer<typeof CreateBudgetFormSchema>) => {
    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      const response = await axios.post('/api/transaction/group/', data, {
        signal: newController.signal,
      });

      toast.success(`${response.data}`);
      queryClient.invalidateQueries({ queryKey: ['groupBudgets'] });
      handleClose();
    } catch (error) {
      logError(
        () => captureException(`Frontend - create new group budget: ${error}`),
        error,
      );

      if (axios.isCancel(error)) {
        return toast.warning('Anulowano tworzenie budżetu');
      }

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data) {
          toast.error('Błąd wysyłania', { description: error.response.data.error });
        } else {
          toast.error('Błąd wysyłania', { description: 'Nieznany błąd' });
        }
      } else {
        toast.error('Nieznany błąd');
      }
    }
  };

  const content = (
    <Form {...form}>
      <form className="space-y-4 sm:space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa budżetu</FormLabel>
              <FormControl>
                <Input type="name" placeholder="Wpisz nazwę" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleClose}
      isLoading={form.formState.isSubmitting}
      title="Tworzenie budżetu"
      description="Podaj nazwę nowego budżetu grupowego, aby kontynuować."
      content={content}
      handleDialog={form.handleSubmit(submitNewBudget)}
      actionText="Utwórz"
    />
  );
};
