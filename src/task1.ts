// Перегрузки (Overloads)
function formatInput(value: number): string;
function formatInput(value: string): string;
function formatInput(value: Date): string;
function formatInput(value: number | string | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  switch (typeof value) {
    case 'number':
      return value.toFixed(2);
    case 'string':
      return value.trim();
    default:
      // Проверка на исчерпываемость (exhaustiveness check)
      const exhaustiveCheck: never = value;
      throw new Error(`Неизвестный тип: ${exhaustiveCheck}`);
  }
}

console.log('--- Задача 1 ---');
console.log('Число:', formatInput(123.456));      // "123.46"
console.log('Строка:', formatInput('  hello  ')); // "hello"
console.log('Дата:', formatInput(new Date('2023-10-15T12:00:00Z'))); // "2023-10-15T12:00:00.000Z"

export {};