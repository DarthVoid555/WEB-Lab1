function addTag(tags: readonly string[], tag: string): string[] {
    if (tags.includes(tag)) return [...tags];
    return [...tags, tag];
  }
  
  function removeTag(tags: readonly string[], tag: string): string[] {
    return tags.filter(t => t !== tag);
  }
  
  function mergeTags(tags1: readonly string[], tags2: readonly string[]): string[] {
    const result = [...tags1];
    for (const tag of tags2) {
      if (!result.includes(tag)) {
        result.push(tag);
      }
    }
    return result;
  }
  
  console.log('\n--- Задача 4 ---');
  const initialTags = ['js', 'ts', 'node'];
  const tagsToMerge = ['ts', 'vue', 'react'];
  
  const added = addTag(initialTags, 'vue');
  const removed = removeTag(initialTags, 'ts');
  const merged = mergeTags(initialTags, tagsToMerge);
  
  console.log('Исходный массив (не изменился):', initialTags); // ['js', 'ts', 'node']
  console.log('Добавлен vue:', added);
  console.log('Удален ts:', removed);
  console.log('Слияние:', merged);
  
  export {};