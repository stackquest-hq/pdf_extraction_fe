import { writable } from 'svelte/store';

function createFieldSelectionStore() {
  const { subscribe, set, update } = writable({
    selectedField: '',
    annotationType: 'label',
    mode: 'fields' // 'fields' or 'table'
  });

  return {
    subscribe,
    setField: (field) => update(state => ({ ...state, selectedField: field })),
    setType: (type) => update(state => ({ ...state, annotationType: type })),
    setMode: (mode) => update(state => ({ ...state, mode })),
    clear: () => set({ selectedField: '', annotationType: 'label', mode: 'fields' })
  };
}

export const fieldSelection = createFieldSelectionStore(); 