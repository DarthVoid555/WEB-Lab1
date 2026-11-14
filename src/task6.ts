type Invoice = { id: string; amount: number; status: "paid" | "free" };

function sumByStatus(invoices: readonly Invoice[]): { paid: number; free: number } {
  return invoices.reduce(
    (acc, invoice) => {
      if (invoice.status === 'paid') {
        acc.paid += invoice.amount;
      } else {
        acc.free += invoice.amount;
      }
      return acc;
    },
    { paid: 0, free: 0 }
  );
}

console.log('\n--- Задача 6 ---');
const invoices: Invoice[] = [
  { id: '1', amount: 100, status: 'paid' },
  { id: '2', amount: 50, status: 'free' },
  { id: '3', amount: 200, status: 'paid' },
];

console.log('Суммы:', sumByStatus(invoices));
console.log('Пустой массив:', sumByStatus([]));

export {};