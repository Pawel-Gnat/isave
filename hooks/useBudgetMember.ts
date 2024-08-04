import { useState, useEffect } from 'react';
import { captureException } from '@sentry/nextjs';

import getUserById from '@/actions/getUserById';

import { logError } from '@/utils/errorUtils';

import { User } from '@prisma/client';

export default function useBudgetMember(id: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [member, setMember] = useState<User | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      setIsLoading(true);

      try {
        const user = await getUserById(id);
        setMember(user);
      } catch (error) {
        logError(() => captureException(`Hooks - useBudgetMember: ${error}`), error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  return { isLoading, member };
}
