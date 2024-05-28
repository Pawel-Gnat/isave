import { TransactionType } from '@/types/types';

export const getTitle = (
  transactionType: TransactionType,
  isEditing: boolean,
): string => {
  if (transactionType === 'income' && !isEditing) {
    return 'Utwórz nowy przychód';
  }

  if (transactionType === 'income' && isEditing) {
    return 'Edytuj przychód';
  }

  //   if (transactionType === 'expense' && !isEditing) {
  //     return 'Utwórz nowy wydatek';
  //   }

  if (transactionType === 'expense' && isEditing) {
    return 'Edytuj wydatek';
  }

  return '';
};

export const getDescription = (
  transactionType: TransactionType,
  isEditing: boolean,
): string => {
  if (transactionType === 'income' && !isEditing) {
    return 'Dodaj pozycje i zapisz dane';
  }

  if (transactionType === 'income' && isEditing) {
    return 'Skoryguj wybrane pozycje i zapisz zmiany';
  }

  //   if (transactionType === 'expense' && !isEditing) {
  //     return 'Zweryfikuj wydatki lub dodaj je samodzielnie';
  //   }

  if (transactionType === 'expense' && isEditing) {
    return 'Skoryguj wybrane pozycje i zapisz zmiany';
  }

  return '';
};

export const getContent = (
  transactionType: TransactionType,
  isEditing: boolean,
): HTMLElement => {
  if (transactionType === 'income' && !isEditing) {
    return 'Dodaj pozycje i zapisz dane';
  }

  if (transactionType === 'income' && isEditing) {
    return 'Skoryguj wybrane pozycje i zapisz zmiany';
  }

  //   if (transactionType === 'expense' && !isEditing) {
  //     return 'Zweryfikuj wydatki lub dodaj je samodzielnie';
  //   }

  if (transactionType === 'expense' && isEditing) {
    return 'Skoryguj wybrane pozycje i zapisz zmiany';
  }

  return '';
};
