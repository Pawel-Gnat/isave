import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { createWorker } from 'tesseract.js';

import { TransactionsContext } from '@/contexts/transactions-context';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileInputProps {
  onSelect: (value: string) => void;
}

export const FileInput: FC<FileInputProps> = ({ onSelect }) => {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState(false);
  const { isLoading, dispatch } = useContext(TransactionsContext);

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
      return '/error.png';
    }

    if (isLoading && !value) {
      return '/analizing.png';
    }

    if (value) {
      return '/loaded.png';
    }

    return '/upload.png';
  };

  const processImageToBase64 = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: true } });
      setIsError(false);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64String = reader.result as string;
        const worker = await createWorker('eng');
        const result = await worker.recognize(base64String);
        await worker.terminate();

        setValue(result.data.text);
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setIsError(true);
        dispatch({ type: 'SET_IS_LOADING', payload: { isLoading: false } });
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
        className="absolute inset-0 m-auto max-h-72 w-1/2"
      />
      <Label
        htmlFor="file"
        className="text-md absolute inset-0 z-10 rounded-md border-2 border-dashed lg:text-lg"
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
