// Рекурсивный тип Readonly
type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

function deepFreeze<T>(obj: T): DeepReadonly<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as DeepReadonly<T>;
  }

  // Замораживаем текущий уровень
  Object.freeze(obj);

  // Рекурсивно проходим по всем свойствам
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value);
    }
  }

  return obj as DeepReadonly<T>;
}

console.log('\n--- Задача 9 ---');
const data = {
  user: { name: 'Alice', age: 25 },
  tags: ['admin', 'user'],
  nested: {
    arr: [{ id: 1 }, { id: 2 }]
  }
};

const frozen = deepFreeze(data);

console.log('Объект заморожен:', Object.isFrozen(frozen));
console.log('Вложенный объект заморожен:', Object.isFrozen(frozen.user));
console.log('Массив заморожен:', Object.isFrozen(frozen.tags));
console.log('Вложенный массив объектов заморожен:', Object.isFrozen(frozen.nested.arr));

// ts-expect-error - Ошибка типов: нельзя изменить readonly свойство
// frozen.user.name = 'Bob';

export {};