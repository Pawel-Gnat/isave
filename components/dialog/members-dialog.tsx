'use client';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { toast } from 'sonner';

import { AlertContext } from '@/contexts/alert-context';

import useGroupBudgets from '@/hooks/useGroupBudgets';

import { CreateBudgetFormSchema, HandleMemberFormSchema } from '@/utils/formValidations';

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

export const MemberDialog = () => {
  const { isMembershipAlertOpen, groupBudgetId, memberAction, isLoading, dispatch } =
    useContext(AlertContext);
  const { groupBudgetsRefetch } = useGroupBudgets();

  const form = useForm<z.infer<typeof HandleMemberFormSchema>>({
    resolver: zodResolver(HandleMemberFormSchema),
    defaultValues: {
      id: '',
    },
  });

  const handleClose = () => {
    form.reset();
    dispatch({ type: 'SET_HIDE_ALERT' });
  };

  const handleMember = (values: z.infer<typeof HandleMemberFormSchema>) => {
    if (isLoading) return;
    dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });

    // axios
    //   .post(`api/transaction/group/`, values)
    //   .then((response) => {
    //     dispatch({ type: 'SET_HIDE_ALERT' });
    //     toast.success(`${response.data}`);
    //     groupBudgetsRefetch();
    //   })
    //   .catch((error) => {
    //     toast.error(`${error.response.data.error}`);
    //   })
    //   .finally(() => {
    //     dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
    //   });
  };

  const content = (
    <Form {...form}>
      <form className="space-y-4 sm:space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID zaproszenia użytkownika</FormLabel>
              <FormControl>
                <Input type="id" placeholder="ID zaproszenia użytkownika" {...field} />
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
      open={isMembershipAlertOpen}
      onOpenChange={handleClose}
      isLoading={isLoading}
      title={memberAction === 'add' ? 'Dodawanie użytkownika' : 'Usuwanie użytkownika'}
      description={
        memberAction === 'add'
          ? 'Podaj ID zaproszenia użytkownika, aby dodać go do budżetu'
          : 'Podaj ID zaproszenia użytkownika, aby usunąć go z budżetu'
      }
      content={content}
      handleDialog={form.handleSubmit(handleMember)}
      actionText="Utwórz"
    />
  );
};
