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

export const TransactionModal = ({
  open,
  onOpenChange,
  title,
  description,
  content,
  footer,
}: TransactionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80%] min-h-[75%] min-w-[50%] max-w-[90%] flex-col rounded-lg sm:min-h-[60%] md:max-w-[75%] 2xl:max-w-[50%]">
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
