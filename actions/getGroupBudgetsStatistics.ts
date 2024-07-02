// 'use server';

// import prisma from '@/lib/prisma';

// import getCurrentUser from './getCurrentUser';

// import { DateRange } from 'react-day-picker';

// const getGroupBudgetsStatistics = async (date: DateRange) => {
//   try {
//     const currentUser = await getCurrentUser();

//     const ownerBudgets = await prisma.groupBudget.findMany({
//       where: {
//         ownerId: currentUser?.id,
//       },
//       include: {
//         owner: {
//           include: {
//             groupExpenses: {
//               where: {
//                 date: {
//                   gte: date.from,
//                   lte: date.to,
//                 },
//               },
//             },
//             groupIncomes: {
//               where: {
//                 date: {
//                   gte: date.from,
//                   lte: date.to,
//                 },
//               },
//             },
//           },
//         },
//         members: {
//           include: {
//             user: {
//               include: {
//                 groupExpenses: {
//                   where: {
//                     date: {
//                       gte: date.from,
//                       lte: date.to,
//                     },
//                   },
//                 },
//                 groupIncomes: {
//                   where: {
//                     date: {
//                       gte: date.from,
//                       lte: date.to,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//         groupExpenses: {
//           where: {
//             date: {
//               gte: date.from,
//               lte: date.to,
//             },
//           },
//         },
//         groupIncomes: {
//           where: {
//             date: {
//               gte: date.from,
//               lte: date.to,
//             },
//           },
//         },
//       },
//     });

//     const memberBudgets = await prisma.groupBudgetMember.findMany({
//       where: {
//         userId: currentUser?.id,
//       },
//       include: {
//         groupBudget: {
//           include: {
//             owner: {
//               include: {
//                 groupExpenses: {
//                   where: {
//                     date: {
//                       gte: date.from,
//                       lte: date.to,
//                     },
//                   },
//                 },
//                 groupIncomes: {
//                   where: {
//                     date: {
//                       gte: date.from,
//                       lte: date.to,
//                     },
//                   },
//                 },
//               },
//             },
//             members: {
//               include: {
//                 user: {
//                   include: {
//                     groupExpenses: {
//                       where: {
//                         date: {
//                           gte: date.from,
//                           lte: date.to,
//                         },
//                       },
//                     },
//                     groupIncomes: {
//                       where: {
//                         date: {
//                           gte: date.from,
//                           lte: date.to,
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//             groupExpenses: {
//               where: {
//                 date: {
//                   gte: date.from,
//                   lte: date.to,
//                 },
//               },
//             },
//             groupIncomes: {
//               where: {
//                 date: {
//                   gte: date.from,
//                   lte: date.to,
//                 },
//               },
//             },
//           },
//         },
//       },
//     });

//     const memberBudgetsOnly = memberBudgets.map((member) => member.groupBudget);
//     const allBudgets = [...ownerBudgets, ...memberBudgetsOnly];

//     return allBudgets.map((budget) => ({
//       id: budget.id,
//       name: budget.name,
//       totalExpenses: budget.groupExpenses.reduce(
//         (sum, expense) => sum + expense.value / 100,
//         0,
//       ),
//       totalIncomes: budget.groupIncomes.reduce(
//         (sum, income) => sum + income.value / 100,
//         0,
//       ),
//       owner: {
//         name: budget.owner.name,
//         totalExpenses: budget.owner.groupExpenses.reduce(
//           (sum, expense) => sum + expense.value / 100,
//           0,
//         ),
//         totalIncomes: budget.owner.groupIncomes.reduce(
//           (sum, income) => sum + income.value / 100,
//           0,
//         ),
//       },
//       members: budget.members.map((member) => ({
//         name: member.user.name,
//         totalExpenses: member.user.groupExpenses.reduce(
//           (sum, expense) => sum + expense.value / 100,
//           0,
//         ),
//         totalIncomes: member.user.groupIncomes.reduce(
//           (sum, income) => sum + income.value / 100,
//           0,
//         ),
//       })),
//     }));
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

// export default getGroupBudgetsStatistics;

'use server';

import prisma from '@/lib/prisma';

import getCurrentUser from './getCurrentUser';

import { DateRange } from 'react-day-picker';

const getGroupBudgetsStatistics = async (date: DateRange) => {
  try {
    const currentUser = await getCurrentUser();

    const ownerBudgets = await prisma.groupBudget.findMany({
      where: {
        ownerId: currentUser?.id,
      },
      include: {
        owner: true,
        groupExpenses: {
          where: {
            date: {
              gte: date.from,
              lte: date.to,
            },
          },
        },
        groupIncomes: {
          where: {
            date: {
              gte: date.from,
              lte: date.to,
            },
          },
        },
        members: {
          include: {
            user: {
              include: {
                groupExpenses: {
                  where: {
                    date: {
                      gte: date.from,
                      lte: date.to,
                    },
                  },
                },
                groupIncomes: {
                  where: {
                    date: {
                      gte: date.from,
                      lte: date.to,
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const memberBudgets = await prisma.groupBudgetMember.findMany({
      where: {
        userId: currentUser?.id,
      },
      include: {
        groupBudget: {
          include: {
            owner: true,
            groupExpenses: {
              where: {
                date: {
                  gte: date.from,
                  lte: date.to,
                },
              },
            },
            groupIncomes: {
              where: {
                date: {
                  gte: date.from,
                  lte: date.to,
                },
              },
            },
            members: {
              include: {
                user: {
                  include: {
                    groupExpenses: {
                      where: {
                        date: {
                          gte: date.from,
                          lte: date.to,
                        },
                      },
                    },
                    groupIncomes: {
                      where: {
                        date: {
                          gte: date.from,
                          lte: date.to,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const memberBudgetsOnly = memberBudgets.map((member) => member.groupBudget);
    const allBudgets = [...ownerBudgets, ...memberBudgetsOnly];

    return allBudgets.map((budget) => {
      const ownerExpenses = budget.groupExpenses.filter(
        (expense) => expense.userId === budget.ownerId,
      );
      const ownerIncomes = budget.groupIncomes.filter(
        (income) => income.userId === budget.ownerId,
      );

      return {
        id: budget.id,
        name: budget.name,
        totalExpenses: budget.groupExpenses.reduce(
          (sum, expense) => sum + expense.value / 100,
          0,
        ),
        totalIncomes: budget.groupIncomes.reduce(
          (sum, income) => sum + income.value / 100,
          0,
        ),
        owner: {
          name: budget.owner.name,
          totalExpenses: ownerExpenses.reduce(
            (sum, expense) => sum + expense.value / 100,
            0,
          ),
          totalIncomes: ownerIncomes.reduce((sum, income) => sum + income.value / 100, 0),
        },
        members: budget.members.map((member) => ({
          name: member.user.name,
          totalExpenses: member.user.groupExpenses.reduce(
            (sum, expense) => sum + expense.value / 100,
            0,
          ),
          totalIncomes: member.user.groupIncomes.reduce(
            (sum, income) => sum + income.value / 100,
            0,
          ),
        })),
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getGroupBudgetsStatistics;
