import { writable } from 'svelte/store';

function createAnnotationsStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    add: (annotation) => update(annotations => [...annotations, annotation]),
    remove: (id) => update(annotations => annotations.filter(a => a.id !== id)),
    clear: () => set([])
  };
}

export const annotations = createAnnotationsStore(); 