import { FC } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  content: JSX.Element;
  footer: JSX.Element;
}

export const TransactionModal: FC<TransactionModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  content,
  footer,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[75%] min-h-[60%] min-w-[50%] max-w-[75%] flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-1 justify-center overflow-auto">{content}</div>
        <DialogFooter className="flex gap-2 sm:justify-between">{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
