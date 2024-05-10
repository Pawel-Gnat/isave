import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const FileInput = () => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">Zdjęcie rachunku</Label>
      <Input id="picture" type="file" />
    </div>
  );
};
