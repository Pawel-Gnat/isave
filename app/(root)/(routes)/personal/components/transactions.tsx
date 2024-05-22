import Image from 'next/image';
import { format } from 'date-fns';

import { columns } from './table-columns';
import { TransactionTable } from './transaction-table';

import { PersonalExpenses, PersonalIncome } from '@prisma/client';

// async function getData(): Promise<PersonalIncomes[] | PersonalExpenses[]> {
//   return [
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//     {
//       name: 'Zakupy',
//       date: format(new Date(), 'yyyy-MM-dd'),
//       value: 200,
//     },
//   ];
// }

export const Transactions = async () => {
  // const data = await getData();
  const data = [];

  return (
    <div>
      <Image
        src="/empty.png"
        alt=""
        width={300}
        height={300}
        className="m-auto aspect-square"
        // className="absolute inset-0 m-auto aspect-square max-h-72"
      />
      <TransactionTable columns={columns} data={data} />
    </div>
  );
};
