'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { captureException } from '@sentry/nextjs';

import { logError } from '@/utils/errorUtils';

interface ActivatePageProps {
  id: string;
}

const ActivatePage = ({ params }: { params: ActivatePageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await axios.patch(`/api/activate/${params.id}`);
        toast.success(`${response.data}`);
      } catch (error) {
        logError(
          () => captureException(`Activate page - activation failed: ${error}`),
          error,
        );

        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data.error);
        } else {
          toast.error('Błąd aktywacji');
        }
      } finally {
        router.push('/auth');
      }
    };

    activateAccount();
  }, [params.id]);

  return <></>;
};

export default ActivatePage;
