// Перегрузки для pipeline (1, 2 и 3 шага)
function applyPipeline<A, B>(input: A, step1: (a: A) => B): B;
function applyPipeline<A, B, C>(input: A, step1: (a: A) => B, step2: (b: B) => C): C;
function applyPipeline<A, B, C, D>(input: A, step1: (a: A) => B, step2: (b: B) => C, step3: (c: C) => D): D;

// Реализация
function applyPipeline(input: unknown, ...steps: ((arg: unknown) => unknown)[]): unknown {
  let result = input;
  for (const step of steps) {
    result = step(result);
  }
  return result;
}

console.log('\n--- Задача 5 ---');
const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const toStr = (n: number) => `Result: ${n}`;

console.log('1 шаг:', applyPipeline(5, addOne));
console.log('2 шага:', applyPipeline(5, addOne, double));
console.log('3 шага:', applyPipeline(5, addOne, double, toStr));

// ts-expect-error - Несовместимые типы: step2 ожидает number, а step1 возвращает string
// applyPipeline(5, (n) => n.toString(), (s) => s + 10);

export {};