function chunkArray<T>(items: readonly T[], chunkSize: number): T[][] {
    if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
      throw new RangeError('Размер блока должен быть положительным целым числом');
    }
  
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      result.push(items.slice(i, i + chunkSize));
    }
    return result;
  }
  
  console.log('\n--- Задача 7 ---');
  const numbers = [1, 2, 3, 4, 5, 6, 7];
  console.log('Числа по 3:', chunkArray(numbers, 3));
  console.log('Строки по 2:', chunkArray(['a', 'b', 'c', 'd'], 2));
  console.log('Пустой массив:', chunkArray([], 5));
  
  try {
    chunkArray(numbers, 0);
  } catch (e) {
    if (e instanceof RangeError) console.log('Ожидаемая ошибка:', e.message);
  }
  
  export {};