import { ChangeEvent, FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { createWorker } from 'tesseract.js';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileInputProps {
  onSelect: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export const FileInput: FC<FileInputProps> = ({ onSelect, isLoading, setIsLoading }) => {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    onSelect(value);
  }, [value]);

  const handleLabelText = () => {
    if (isError) {
      return 'Błąd wczytywania';
    }

    if (isLoading && !value) {
      return 'Wczytywanie zdjęcia';
    }

    if (value) {
      return 'Wczytano zdjęcie';
    }

    return 'Dodaj zdjęcie rachunku';
  };

  const handleImage = () => {
    if (isError) {
      return '/modal-error.svg';
    }

    if (isLoading && !value) {
      return '/modal-loading.svg';
    }

    if (value) {
      return '/modal-sync.svg';
    }

    return '/modal-addfile.svg';
  };

  const processImageToBase64 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setIsLoading(true);
      setIsError(false);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result as string;
        const worker = await createWorker('eng');
        const result = await worker.recognize(base64String);
        await worker.terminate();

        setValue(result.data.text);
        setIsLoading(false);
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setIsError(true);
        setIsLoading(false);
      };
    }
  };

  return (
    <>
      <Image
        src={handleImage()}
        alt=""
        width={300}
        height={300}
        className="absolute inset-0 m-auto aspect-square max-h-72"
      />
      <Label
        htmlFor="file"
        className="text-md absolute inset-0 z-10 rounded-md border-2 border-dashed"
      >
        <p className="relative top-[80%] text-center">{handleLabelText()}</p>
        <Input
          id="file"
          type="file"
          onChange={processImageToBase64}
          className="hidden"
          accept="image/*"
        />
      </Label>
    </>
  );
};
