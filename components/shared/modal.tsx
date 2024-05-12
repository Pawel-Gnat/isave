'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { LoadingButton } from './loading-button';

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  actionButton: () => void;
  title: string;
  description: string;
  content: React.ReactNode;
  actionButtonLabel: string;
  secondaryActionButton: () => void;
  secondaryActionButtonLabel: string | undefined;
  previousActionButtonLabel: string;
  previousActionButton: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  setIsOpen,
  actionButton,
  title,
  description,
  content,
  actionButtonLabel,
  secondaryActionButton,
  secondaryActionButtonLabel,
  previousActionButtonLabel,
  previousActionButton,
  disabled,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex h-1/2 max-h-none min-h-fit w-1/2 min-w-fit max-w-none flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-1 items-center justify-center">{content}</div>
        <DialogFooter className=" gap-2 sm:justify-between">
          <Button variant="outline" onClick={() => previousActionButton()}>
            {previousActionButtonLabel}
          </Button>

          <div className="flex flex-row gap-2">
            {secondaryActionButtonLabel && (
              <LoadingButton
                // variant="outline"
                isLoading={isLoading}
                onClick={() => secondaryActionButton()}
                text={secondaryActionButtonLabel}
              />
            )}

            <Button variant="outline" onClick={() => actionButton()} disabled={disabled}>
              {actionButtonLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
