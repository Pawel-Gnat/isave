import { useState, useEffect } from 'react';

import getUserById from '@/actions/getUserById';

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
        console.log(error);
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
