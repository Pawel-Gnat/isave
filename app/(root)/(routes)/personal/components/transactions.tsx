import Image from 'next/image';

import { columns } from './table-columns';
import { TransactionTable } from './transaction-table';

import { PersonalExpenses, PersonalIncomes } from '@prisma/client';
import getPersonalExpenses from '@/actions/getPersonalExpenses';

export const Transactions = async () => {
  const personalExpenses = await getPersonalExpenses();
  const data = [...(personalExpenses as PersonalExpenses[])];

  return (
    <div className="flex flex-1 flex-col">
      {data.length > 0 ? (
        <TransactionTable columns={columns} data={data} />
      ) : (
        <div className="m-auto text-center">
          <Image
            src="/empty.png"
            alt=""
            width={300}
            height={300}
            className="aspect-square"
          />
          <p className="font-medium">Brak transakcji dla wybranego miesiąca</p>
        </div>
      )}
    </div>
  );
};
