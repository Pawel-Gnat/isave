import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { toast } from 'sonner';

import { HandleMemberFormSchema } from '@/utils/formValidations';
import { handleApiMembersRoute } from '@/utils/dialogUtils';

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
import { InitialState } from './client-page';
import { useQueryClient } from '@tanstack/react-query';
import { logError } from '@/utils/errorUtils';
import { captureException } from '@sentry/nextjs';

interface MembersDialogProps {
  isOpen: InitialState;
  setIsOpen: (isOpen: InitialState) => void;
}

export const MembersDialog = ({ isOpen, setIsOpen }: MembersDialogProps) => {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);

  const form = useForm<z.infer<typeof HandleMemberFormSchema>>({
    resolver: zodResolver(HandleMemberFormSchema),
    defaultValues: {
      inviteId: '',
    },
  });

  const handleClose = () => {
    form.reset();
    setIsOpen({ isMemberDialogOpen: false, action: null, groupBudgetId: '' });
  };

  const handleMember = async (values: z.infer<typeof HandleMemberFormSchema>) => {
    if (form.formState.isSubmitting) return;

    const newController = new AbortController();
    controllerRef.current = newController;

    try {
      let response;

      if (isOpen.action === 'add') {
        response = await axios.post(
          handleApiMembersRoute('add', isOpen.groupBudgetId, values.inviteId),
          values,
          { signal: newController.signal },
        );
      } else {
        response = await axios.delete(
          handleApiMembersRoute('remove', isOpen.groupBudgetId, values.inviteId),
          {
            signal: newController.signal,
          },
        );
      }

      toast.success(`${response.data}`);
      queryClient.invalidateQueries({ queryKey: ['groupBudgets'] });
      handleClose();
    } catch (error) {
      logError(
        () => captureException(`Frontend - ${isOpen.action} group member: ${error}`),
        error,
      );

      if (axios.isCancel(error)) {
        return toast.warning('Anulowano zapytanie');
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
          name="inviteId"
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
      open={isOpen.isMemberDialogOpen}
      onOpenChange={handleClose}
      isLoading={form.formState.isSubmitting}
      title={isOpen.action === 'add' ? 'Dodawanie użytkownika' : 'Usuwanie użytkownika'}
      description={
        isOpen.action === 'add'
          ? 'Podaj ID zaproszenia użytkownika, aby dodać go do budżetu'
          : 'Podaj ID zaproszenia użytkownika, aby usunąć go z budżetu'
      }
      content={content}
      handleDialog={form.handleSubmit(handleMember)}
      actionText={isOpen.action === 'add' ? 'Zaproś' : 'Usuń'}
    />
  );
};
