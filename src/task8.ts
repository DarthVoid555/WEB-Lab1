interface Entity {
    id: string;
  }
  
  interface Repository<T extends Entity> {
    create(item: T): T;
    findById(id: string): T | undefined;
    update(id: string, changes: Partial<Omit<T, "id">>): T | undefined;
    delete(id: string): boolean;
  }
  
  class MemoryRepository<T extends Entity> implements Repository<T> {
    private items: Map<string, T> = new Map();
  
    create(item: T): T {
      if (this.items.has(item.id)) {
        throw new Error(`Сущность с id "${item.id}" уже существует`);
      }
      this.items.set(item.id, item);
      return item;
    }
  
    findById(id: string): T | undefined {
      return this.items.get(id);
    }
  
    update(id: string, changes: Partial<Omit<T, "id">>): T | undefined {
      const existing = this.items.get(id);
      if (!existing) return undefined;
      
      // Обновляем, запрещая менять id (через Omit и spread)
      const updated = { ...existing, ...changes } as T;
      this.items.set(id, updated);
      return updated;
    }
  
    delete(id: string): boolean {
      return this.items.delete(id);
    }
  }
  
  console.log('\n--- Задача 8 ---');
  interface Book extends Entity {
    title: string;
    author: string;
  }
  
  const bookRepo = new MemoryRepository<Book>();
  console.log('Create:', bookRepo.create({ id: 'b1', title: '1984', author: 'George Orwell' }));
  
  try {
    bookRepo.create({ id: 'b1', title: 'Duplicate', author: 'Unknown' });
  } catch (e) {
    if (e instanceof Error) console.log('Ожидаемая ошибка:', e.message);
  }
  
  console.log('Update:', bookRepo.update('b1', { title: 'Nineteen Eighty-Four' }));
  console.log('Find missing:', bookRepo.findById('b2'));
  console.log('Delete:', bookRepo.delete('b1'));
  console.log('Delete missing:', bookRepo.delete('b1'));
  
  export {};