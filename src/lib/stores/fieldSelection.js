import { writable } from 'svelte/store';

function createFieldSelectionStore() {
  const { subscribe, set, update } = writable({
    selectedField: '',
    annotationType: 'label'
  });

  return {
    subscribe,
    setField: (field) => update(state => ({ ...state, selectedField: field })),
    setType: (type) => update(state => ({ ...state, annotationType: type })),
    clear: () => set({ selectedField: '', annotationType: 'label' })
  };
}

export const fieldSelection = createFieldSelectionStore(); 