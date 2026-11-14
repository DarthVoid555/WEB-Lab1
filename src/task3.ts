// Брендированный тип (Branded Type)
type UserId = string & { readonly brand: unique symbol };

// Сторож типа (Type Guard)
function isUserId(value: unknown): value is UserId {
  if (typeof value !== 'string') return false;
  // Проверка формата UUID (8-4-4-4-12)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function getUserProfile(id: UserId) {
  return { id, name: 'John Doe', role: 'Admin' };
}

console.log('\n--- Задача 3 ---');
const validUuid = '123e4567-e89b-12d3-a456-426614174000';
const invalidUuid = 'not-a-uuid';
const numberValue = 123;

function tryGetProfile(val: unknown) {
  if (isUserId(val)) {
    console.log('Успех:', getUserProfile(val));
  } else {
    console.log(`Ошибка: Значение "${val}" не является корректным UserId`);
  }
}

tryGetProfile(validUuid);
tryGetProfile(invalidUuid);
tryGetProfile(numberValue);

export {};