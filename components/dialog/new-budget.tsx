'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { toast } from 'sonner';

import { AlertContext } from '@/contexts/alert-context';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { CreateBudgetFormSchema } from '@/utils/formValidations';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '../ui/input';

import { Dialog } from './dialog';

export const NewBudget = () => {
  const { isCreateBudgetAlertOpen, isLoading, dispatch } = useContext(AlertContext);
  const { groupBudgetsRefetch } = useGroupBudgets();

  const form = useForm<z.infer<typeof CreateBudgetFormSchema>>({
    resolver: zodResolver(CreateBudgetFormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleClose = () => {
    form.reset();
    dispatch({ type: 'SET_HIDE_ALERT' });
  };

  const handleCreate = (values: z.infer<typeof CreateBudgetFormSchema>) => {
    if (isLoading) return;
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

    axios
      .post(`api/transaction/group/`, values)
      .then((response) => {
        handleClose();
        toast.success(`${response.data}`);
        groupBudgetsRefetch();
      })
      .catch((error) => {
        toast.error(`${error.response.data.error}`);
      })
      .finally(() => {
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      });
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
      open={isCreateBudgetAlertOpen}
      onOpenChange={handleClose}
      isLoading={isLoading}
      title="Tworzenie budżetu"
      description="Podaj nazwę nowego budżetu grupowego, aby kontynuować."
      content={content}
      handleDialog={form.handleSubmit(handleCreate)}
      actionText="Utwórz"
    />
  );
};
