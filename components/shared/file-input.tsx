import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);

  const handleLabelText = () => {
    if (isError) {
      return 'Błąd wczytywania';
    }

    if (isLoading) {
      return 'Wczytywanie zdjęcia';
    }

    if (inputRef.current && inputRef.current.files && inputRef.current.files.length > 0) {
      return 'Wczytano zdjęcie';
    }

    return 'Dodaj zdjęcie rachunku';
  };

  const handleImage = () => {
    if (isError) {
      return '/modal-error.svg';
    }

    if (isLoading) {
      return '/modal-loading.svg';
    }

    if (inputRef.current && inputRef.current.files && inputRef.current.files.length > 0) {
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

        onSelect(result.data.text);
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
          ref={inputRef}
          className="hidden"
          accept="image/*"
        />
      </Label>
    </>
  );
};
