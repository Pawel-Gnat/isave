'use client';

import { FC } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { LoadingButton } from '../shared/loading-button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  content?: JSX.Element;
  handleDialog: () => void;
  actionText: string;
  isLoading: boolean;
}

export const Dialog: FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  content,
  handleDialog,
  actionText,
  isLoading,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[90%] rounded-lg sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {content}
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <LoadingButton isLoading={isLoading} onClick={handleDialog} text={actionText} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
