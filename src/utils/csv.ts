import { Transaction } from '../types/finance';

/**
 * CSV Reporter
 * Generates and downloads a CSV export file using Blob.
 * Headers: Name, Email, Transaction ID, Title, Category, Type, Amount, Date, Time
 */
export const exportTransactionsToCsv = (
  transactions: Transaction[],
  userName: string = 'Santo',
  userEmail: string = 'santo@wealthai.private'
): void => {
  const headers = [
    'Name',
    'Email',
    'Transaction ID',
    'Title',
    'Category',
    'Type',
    'Amount',
    'Date',
    'Time',
  ];

  const rows = transactions.map((t) => [
    `"${userName.replace(/"/g, '""')}"`,
    `"${userEmail.replace(/"/g, '""')}"`,
    `"${t.id}"`,
    `"${t.title.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.type}"`,
    t.amount.toFixed(2),
    `"${t.date}"`,
    `"${t.time}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const filename = `WealthAI_Report_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
