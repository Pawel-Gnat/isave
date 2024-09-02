import useBudgetMember from '@/hooks/useBudgetMember';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface BudgetBadgeProps {
  owner: boolean;
  id: string;
  onClick: (id: string) => void;
}

export const BudgetBadge = ({ id, owner, onClick }: BudgetBadgeProps) => {
  const { member, isLoading } = useBudgetMember(id);

  if (isLoading) {
    return <Skeleton className="h-6 w-24 rounded-full" />;
  }

  return (
    <>
      {member && (
        <Button
          variant="ghost"
          className="h-fit p-0"
          onClick={(e) => {
            e.preventDefault();
            onClick(member.inviteId);
          }}
        >
          <Badge variant={owner ? 'default' : 'secondary'}>{member.name}</Badge>
        </Button>
      )}
    </>
  );
};
